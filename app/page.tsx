'use client';

import NFLStatsTable from './components/NFLStatsTable';
import UpcomingGames from './components/UpcomingGames';
// import TeamTrends from './components/TeamTrends';
import page_metadata from '../public/data/nfl-team-strength-metadata.json';
import { useState, useEffect } from 'react';

// Placeholder components
// const UpcomingGames = () => (
//   <div className="w-full p-4">
//     <h3 className="text-xl font-bold">Upcoming Games</h3>
//     <p>Coming soon: Game predictions and analysis</p>
//   </div>
// );

const TeamTrends = () => (
  <div className="w-full p-4">
    <h3 className="text-xl font-bold">Team Trends</h3>
    <p>Coming soon: Team performance trends over time</p>
  </div>
);

export default function Home() {
  const [activeView, setActiveView] = useState('rankings');

  const renderActiveView = () => {
    switch (activeView) {
      case 'rankings':
        return <NFLStatsTable />;
      case 'games':
        return <UpcomingGames />;
      case 'trends':
        return <TeamTrends />;
      default:
        return <NFLStatsTable />;
    }
  };
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
  setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold font-sans">2024 NFL Team Strength & Forecast</h1>
      <h2 className="text-xl font-light mb-8 font-sans">{page_metadata.weekNumber} Results</h2>
      
      {/* Navigation Buttons */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveView('rankings')}
          className={`px-4 py-2 rounded-lg font-sans ${
            activeView === 'rankings'
            ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          Team Rankings
        </button>
        <button
          onClick={() => setActiveView('games')}
          className={`px-4 py-2 rounded-lg font-sans ${
            activeView === 'games'
            ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          Upcoming Games
        </button>
        <button
          onClick={() => setActiveView('trends')}
          className={`px-4 py-2 rounded-lg font-sans ${
            activeView === 'trends'
              ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          Team Trends
        </button>
      </div>

      {/* Description paragraphs */}
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

      {/* Render active view */}
      {renderActiveView()}

      {/* Footer */}
      <p className="text-sm font-light mb-4 font-sans"></p>
      <p className="text-sm font-sans">Built by James H. K. Campbell with Vercel, React, and SciPy</p>
      <a className="text-sm text-blue-600 hover:text-blue-800 underline mb-4 font-sans" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/jameshkc">LinkedIn</a>
    </main>
  );
}