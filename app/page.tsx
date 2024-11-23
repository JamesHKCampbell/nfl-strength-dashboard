import NFLStatsTable from './components/NFLStatsTable';
import page_metadata from '../public/data/nfl-team-strength-metadata.json';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold font-sans">2024 NFL Team Strength & Forecast</h1>
      <h2 className="text-xl font-light mb-8 font-sans">{page_metadata.weekNumber} Results</h2>
      <p className="text-sm mb-2 font-sans">
        This modeling project will calculate weekly-updating Team Strength scores for teams in the NFL by analyzing not just how many games each team has won/lost but which opponents teams have won/lost to. 
      </p>
      <p className="text-sm mb-2 font-sans">
        This project uses a <b>&quot;maximum likelihood&quot;</b> model to assign a strength score between 1 and 100 to every team, adjusting the scores to fit best with the actual records of head-to-head wins and losses. Beating a great team or losing to a bad one will shift these scores the most, while an &quot;expected&quot; result moves the needle less. 
      </p>
      <p className="text-sm mb-8 font-sans">
        With strength of schedule varying significantly between teams - especially partway through seasons - this Team Strength model can give a significantly more nuanced measure of prowess than simple Win-Loss records.
      </p>
      <h2 className="text-sm mb-2 font-sans"><b>Model last updated:</b> {page_metadata.updated_at}</h2>

      <NFLStatsTable />
      <p className="text-sm font-light mb-4 font-sans"></p>
      <p className="text-sm font-sans">Built by James H. K. Campbell, for a bit of fun</p>
      <a className="text-sm text-blue-600 hover:text-blue-800 underline mb-4 font-sans" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/jameshkc">LinkedIn</a>
    </main>
  );
}