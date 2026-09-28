export default function Footer() {
  return (
    <footer className="relative z-10 w-full backdrop-blur-sm bg-black/60 border-t border-white/10 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Sagar Singh Thapa. All rights reserved.</p>
      </div>
    </footer>
  );
}
