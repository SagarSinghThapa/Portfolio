import { Star, GitFork, BookOpen } from "lucide-react";

type Repo = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
};

async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/SagarSinghThapa/repos?sort=updated&per_page=4",
      { next: { revalidate: 3600 } } // Revalidate every hour
    );
    
    if (!res.ok) {
      return [];
    }
    
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function GitHubActivity() {
  const repos = await getRepos();

  if (!repos || repos.length === 0) {
    return null; // Don't render the section if the API fails or returns no repos
  }

  return (
    <section id="github" className="py-24 relative z-10 w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from GitHub</h2>
          <div className="w-20 h-1.5 bg-red-600 dark:bg-rose-500 mx-auto rounded-full" />
          <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            A look at my recent open-source activity and side projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map((repo) => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group backdrop-blur-md bg-black/20 border border-white/5 rounded-2xl p-6 hover:shadow-lg transition-all hover:bg-black/40 hover:border-red-500/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 text-red-500 dark:text-rose-400">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-rose-400 transition-colors">
                    {repo.name}
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 h-12 line-clamp-2">
                {repo.description || "No description provided."}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                {repo.language && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600 dark:bg-rose-500" />
                    {repo.language}
                  </div>
                )}
                <div className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Star className="w-4 h-4" />
                  {repo.stargazers_count}
                </div>
                <div className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <GitFork className="w-4 h-4" />
                  {repo.forks_count}
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://github.com/SagarSinghThapa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 backdrop-blur-sm bg-black/20 rounded-lg text-sm font-semibold text-gray-300 hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Follow me on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
