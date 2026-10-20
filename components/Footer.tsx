export default function Footer() {
  return (
    <footer className="relative z-10 w-full backdrop-blur-md bg-black/60 border-t border-white/[0.08] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#A1A1AA] text-sm">
        <p>© {new Date().getFullYear()} Sagar Singh Thapa. All rights reserved.</p>
      </div>
    </footer>
  );
}
