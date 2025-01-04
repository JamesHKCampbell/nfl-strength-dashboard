'use client';

import NFLStatsTable from './components/NFLStatsTable';
import UpcomingGames from './components/UpcomingGames';
import TeamTrends from './components/TeamTrends';
import page_metadata from '../public/data/nfl-team-strength-metadata.json';
import { useState, useEffect } from 'react';

// Placeholder components
// const UpcomingGames = () => (
//   <div className="w-full p-4">
//     <h3 className="text-xl font-bold">Upcoming Games</h3>
//     <p>Coming soon: Game predictions and analysis</p>
//   </div>
// );

const AppendixModelArchitecture = () => (
  <div className="w-full p-4">
    <h3 className="text-3xl font-bold">Model Architecture</h3>
    <p className="mb-8 max-w-screen-md">This NFL team strength & forecast model actually contains two models, one for each stage in the forecast.</p>

    <h4 className="text-xl font-bold">Step 1. Maximum Likelihood Model for Team Strength Scores</h4>
    <p className="mb-4 max-w-screen-md">Each team's "strength" is modeled using a "maximum likelihood" model, a type of parametric optimization model where the modeler has a known set of outcomes and the optimizer adjusts a set of parameters to maximize the likelihood that that specific set of outcomes would have occurred.</p>
    <p className="mb-4 max-w-screen-md">In this case, the parameters are a set of strength scores - ranging from 1 to 99 - assigned to each team, where a score of 50 is an "average" NFL team. The set of outcomes are the actual wins and losses between specific opponents.</p>
    <p className="mb-4 max-w-screen-md">The model starts with a set of randomly generated team strength scores, and then adjusts these scores until the actual wins & losses are as likely as possible.</p>
    <p className="mb-4 max-w-screen-md">If your team beats a great team like the Kansas City Chiefs, the model will adjust your team's strength score upwards to make that result more "likely". But it can't go too far, because your team probably lost to the Buccaneers in Week 2, and it needs to keep that result likely as well.</p>

    <img className="mb-4 max-w-screen-md" src="http://mainspringlab.com/wp-content/uploads/2025/01/Vikings-Commanders-Max-Likelihood-Model-Example.png" alt="Example tables of basic max likelihood model results for the Vikings & Commanders, showing how two different 2-2 teams could have very different strength scores."></img>
    <p className="font-bold max-w-screen-md">Example: </p>
    <p className="mb-4 max-w-screen-md">In the basic example shown above, we are 4 weeks into the season and the Minnesota Vikings and Washington Commanders are both 2-2. A naive model would suggest that the two teams are about equally good.</p>
    <p className="mb-4 max-w-screen-md">However, the Vikings have played tougher opponents. The best team they've beaten - the 49ers - have a strength score of 53.4, while the best team the Commanders have beaten - the NY Giants - have a strength score of only 23.8.</p>
    <p className="mb-4 max-w-screen-md">The model is trying to maximize the likelihood that the actual results occurred - the column in green - so it estimates that the Vikings are a significantly stronger team than the Commanders despite the teams having identical records.</p>

    <p className="mb-4 max-w-screen-md">In actual practice, all of the teams' strength scores are optimized simultaneously, so that they all affect one another in a balanced network. By keeping all of these results in balance, the model is able to score each team's strength based not just on the number of wins & losses, but the strength of the teams you won and lost to. This network of interconnected results allows scores to capture nuances like differences in schedule strength, variable performance, and adapts over time as the understanding of team strength evolves. </p>
    
    <p className="font-bold max-w-screen-md">Additional Layers: </p>
    <p className="mb-4 max-w-screen-md">While that covers the foundation of the maximum likelihood model used here, the details always matter. </p>
    <ul className="mb-8 list-disc pl-8 max-w-screen-sm">
        <li><b>Time-Weighted Error:</b> The model discounts error from older games using an exponential decay function, with a substantial discount for games from previous seasons.</li>
        <li><b>Sigmoid Function for Win Likelihood:</b> The model uses a sigmoid function to translate the pair of team strength scores into a win likelihood for each team.</li>
        <li><b>(TO DO:) Home Field Advantage:</b> The model should include an additional parameter for home field advantage, an expected factor in win likelihoods in the NFL. This has not been added yet.</li>
        <li><b>(TO DO:) Major Injury Adjustments:</b> The model should include additional parameters to account for major injuries including A) QB1s and B) Pro Bowl players. This has not been added yet.</li>
    </ul>

    <h4 className="text-xl font-bold">Step 2. Monte Carlo Simulations for Season & Playoff Outcomes</h4>
    <p className="mb-4 max-w-screen-md">In order to predict the division winners, who makes the playoffs, and who wins the Superbowl, this model takes the team strength parameters from the first model and uses them as inputs for a Monte Carlo simulation model.</p>
    <p className="mb-4 max-w-screen-md">Monte Carlo modeling involves running "rolling the dice" by running probabilistic simulations of scenarios over and over again, and measuring the number of fully-simulated scenarios where given outcomes occur. This simulation of empirical scenarios allows modelers to make predictions about connected chains of actions in the real world that classical statistical methods struggle with.</p>
    <p className="mb-4 max-w-screen-md">For example, you could predict the odds of heads and tails theoretically or use Monte Carlo - by flipping a coin 10,000 times - and get the same answer. But for scenarios like the NFL playoffs - where the remaining results in the season lead to different playoff seeding which then affects which games have to be played - Monte Carlo is very useful.</p>
    <p className="mb-4 max-w-screen-md">This NFL model runs full scenarios of all remaining games in the season, creates the playoff rounds based on seeding and tiebreaker rules and simulates each of those, until it simulates the Superbowl. The model runs 10,000 of these full simulations in every update to calculate the <b>% Probabilities</b> of <b>Making the Playoffs</b>, <b>Winning the Division</b>, and <b>Winning the Superbowl</b>.</p>


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
      case 'modelarchitecture':
        return <AppendixModelArchitecture />;
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
        <button
          onClick={() => setActiveView('modelarchitecture')}
          className={`px-4 py-2 rounded-lg font-sans ${
            activeView === 'modelarchitecture'
              ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white')
              : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          Appendix: Model Architecture
        </button>
      </div>

      {/* Description paragraphs */}
      <p className="text-sm mb-2 font-sans">
        This modeling project calculates weekly-updating Team Strength scores for teams in the NFL by analyzing not just how many games each team has won/lost but which opponents teams have won/lost to. 
      </p>
      <p className="text-sm mb-2 font-sans">
        This project uses a <b>&quot;maximum likelihood&quot;</b> model to assign a strength score between 1 and 100 to every team, adjusting the scores to fit best with the actual records of head-to-head wins and losses. Beating a great team or losing to a bad one will shift these scores the most, while an &quot;expected&quot; result moves the needle less.         With strength of schedule varying significantly between teams - especially partway through seasons - this Team Strength model can give a significantly more nuanced measure of prowess than simple Win-Loss records.
      </p>
      <p className="text-sm mb-2 font-sans">
      </p>
      <p className="text-sm mb-8 font-sans">
        The probabilistic outcomes - the chance to make the playoffs, win the division, or win the Super Bowl - are based on 10,000 simulations of the remaining season and resulting playoffs brackets.
      </p>
      <h2 className="text-sm mb-2 font-sans"><b>Model last updated:</b> {page_metadata.updated_at}</h2>

      {/* Render active view */}
      {renderActiveView()}

      {/* Footer */}
      <p className="text-sm font-light mb-4 font-sans"></p>
      <p className="text-sm font-sans">Built by James H. K. Campbell, for a bit of fun</p>
      <a className="text-sm text-blue-600 hover:text-blue-800 underline  font-sans" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/jameshkc">LinkedIn</a>
      <p className="text-sm font-sans mb-10"></p>
      <a className="text-sm font-bold hover:text-blue-800 mb-2 font-sans" target="_blank" rel="noopener noreferrer" href="https://www.mainspringlab.com">Back to: Mainspring Lab Home Page</a>
    </main>
  );
}