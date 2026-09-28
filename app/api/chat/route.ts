import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages, createUIMessageStreamResponse, toUIMessageStream } from "ai";
import { getDatabase } from "@/lib/mongodb";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const systemPrompt = `You are a helpful, professional, and friendly AI assistant embedded in the portfolio website of Sagar Singh Thapa.
Your primary goal is to answer questions about Sagar's experience, skills, and projects based strictly on the provided context.
Keep your answers concise, clear, and engaging. Avoid hallucinating information not present in the context.

Context about Sagar Singh Thapa:
- Education: B.Tech in Computer Science and Engineering, specializing in Data Science at the University of Petroleum and Energy Studies (UPES), Expected Graduation 2028.
- Location: Dehradun, India.
- Email: sagar@example.com (Placeholder, users can use the Contact form)
- GitHub: https://github.com/SagarSinghThapa
- LinkedIn: https://linkedin.com/in/sagar1830

Core Skills:
- Programming: Python, Java, C/C++, SQL, JavaScript, TypeScript
- AI/Data Science: Scikit-Learn, PyTorch, Transformers, Pandas, NumPy, Computer Vision, K-Means Clustering, Anomaly Detection, LangGraph, RAG, Hybrid RAG, Gemini API
- Web Development: FastAPI, Flask, Next.js, React.js, Tailwind CSS
- Tools: MongoDB Atlas, Git, Docker, Postman

Experience:
- Data Science Intern @ IBM (Jun 2026 - Jul 2026): Digital Advertising Analytics Project. Built ML workflows (clustering, anomaly detection) and integrated Gemini API for campaign recommendations.
- Web Development & AI Testing Intern @ FYNTL AI (Jun 2025 - Aug 2025): Tested AI APIs via Postman, built React/Tailwind interfaces.
- Data Analytics Intern @ IMPART NGO (Jun 2024 - Aug 2024): Cleaned survey datasets (Python/SQL) for analytical reports.

Key Projects:
1. Alpine Explorer 2.0: Multispectral geospatial AI and offline travel-risk platform for hill stations. Uses Swin Transformers, PlanetScope satellite imagery, and FastAPI.
2. Digital Advertising Analytics: ML platform for campaign analytics built during the IBM internship.
3. Multi-Agent RAG System: An intelligent LangGraph architecture using Hybrid RAG and Gemini API to process complex queries with verified proprietary data.

When asked about contacting Sagar, guide the user to the Contact page or to email him. If asked something completely unrelated to Sagar or his professional domain, politely steer the conversation back to his portfolio.
`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        try {
          const db = await getDatabase();
          if (db) {
            const lastMsg = messages[messages.length - 1];
            await db.collection("chat_logs").insertOne({
              userMessage: lastMsg,
              assistantResponse: text,
              timestamp: new Date(),
            });
          }
        } catch (err) {
          console.error("Failed to log chat to MongoDB:", err);
        }
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
