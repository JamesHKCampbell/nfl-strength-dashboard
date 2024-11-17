import NFLStatsTable from './components/NFLStatsTable';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold font-sans">2024 NFL Team Strength & Forecast</h1>
      <p className="text-lg font-light mb-4 font-sans">Week 10 Results</p>
      <NFLStatsTable />
      <p className="text-sm font-light mb-4 font-sans"></p>
      <p className="text-sm font-light font-sans">Built by James H. K. Campbell, for a bit of fun</p>
      <a className="text-sm font-light text-blue-600 hover:text-blue-800 underline mb-4 font-sans" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/jameshkc">LinkedIn</a>
    </main>
  );
}