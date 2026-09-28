import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDatabase } from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let savedToDb = false;
    let dbError: string | null = null;

    // 1. Save to MongoDB Atlas (if MONGODB_URI is provided)
    try {
      const db = await getDatabase();
      if (db) {
        const collection = db.collection("contacts");
        await collection.insertOne({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim(),
          message: message.trim(),
          createdAt: new Date(),
          status: "new",
          userAgent: req.headers.get("user-agent") || undefined,
        });
        savedToDb = true;
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Database error";
      console.error("MongoDB Atlas insertion error:", errorMsg);
      dbError = errorMsg;
    }

    // 2. Send email via Resend (if RESEND_API_KEY is provided)
    let emailSent = false;
    let emailError: string | null = null;

    if (process.env.RESEND_API_KEY) {
      try {
        const emailResult = await resend.emails.send({
          from: "Portfolio Contact Form <onboarding@resend.dev>",
          to: [process.env.CONTACT_EMAIL || "sagarsinghthapa639@gmail.com"],
          subject: `Portfolio: ${subject}`,
          replyTo: email,
          html: `
            <h2>New Message from Portfolio Website</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr />
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, "<br/>")}</p>
            ${savedToDb ? "<p style='color: green; font-size: 12px;'>✓ Saved to MongoDB Atlas</p>" : ""}
          `,
        });

        if (emailResult.error) {
          emailError = emailResult.error.message;
        } else {
          emailSent = true;
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Email error";
        console.error("Resend email error:", errorMsg);
        emailError = errorMsg;
      }
    }

    // If at least one destination succeeded (DB or Email), return success
    if (savedToDb || emailSent) {
      return NextResponse.json(
        {
          success: true,
          savedToDb,
          emailSent,
        },
        { status: 200 }
      );
    }

    // If neither was configured or both failed
    if (dbError && emailError) {
      return NextResponse.json(
        { error: `Database: ${dbError}, Email: ${emailError}` },
        { status: 500 }
      );
    }

    // Default success response if running in development without credentials
    return NextResponse.json(
      {
        success: true,
        message: "Message received (services pending configuration)",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to process message: ${errorMsg}` },
      { status: 500 }
    );
  }
}
