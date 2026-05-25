export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">About MovieSync</h1>
      
      <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
        <p>
          MovieSync is your personal hub for discovering, tracking, and reviewing your favorite films. 
        </p>
        <p>
          Whether you are looking for what to watch next, trying to remember the name of that sci-fi epic you saw last summer, or wanting to keep a chronological journal of your cinema journey—MovieSync is built for you.
        </p>
        <p>
          Our public feed allows you to browse the latest movies added to our database community. After registering an account, you can build your personal watchlists, mark films as "watched" or "watching", and rate titles to curate your own personal recommendations.
        </p>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">Build your collection today</h2>
        <p className="text-blue-800 mb-4">
          Join a growing community of cinephiles keeping track of their favorite titles.
        </p>
        <a href="/register" className="inline-block px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
          Create an Account
        </a>
      </div>
    </div>
  );
}