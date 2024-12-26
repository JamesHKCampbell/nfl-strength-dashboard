'use client';
import React, { useState, useEffect } from 'react';

interface GameForecast {
  Date: string;
  Home: string;
  Visitor: string;
  Home_Win_Likelihood: number;
  Visitor_Win_Likelihood: number;
  Game_Excitement_Score: number;
}

const UpcomingGames = () => {
  const [games, setGames] = useState<GameForecast[]>([]);

  useEffect(() => {
    fetch('/data/nfl-upcoming-games-forecast.json')
      .then(response => response.json())
      .then(data => {
        // Convert from the JSON format to array of objects
        const gamesArray = Object.keys(data.Date).map(index => ({
          Date: data.Date[index],
          Home: data.Home[index],
          Visitor: data.Visitor[index],
          Home_Win_Likelihood: data.Home_Win_Likelihood[index],
          Visitor_Win_Likelihood: data.Visitor_Win_Likelihood[index],
          Game_Excitement_Score: data.Game_Excitement_Score[index]
        }));
        setGames(gamesArray);
      })
      .catch(error => console.error('Error loading games data:', error));
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }, []);

  const getProbabilityColor = (prob: number) => {
    const opacity = prob / 100;
    // Using similar colors to your existing table
    if (isDarkMode) return `rgba(220, 139, 24, ${opacity})`;
    return `rgba(236, 174, 87, ${opacity})`;  
    };

  const getExcitementColor = (score: number) => {
    const opacity = score / 100;
    // Using similar colors to your existing table
    if (isDarkMode) return `rgba(135, 204, 62, ${opacity})`;
    return `rgba(171, 219, 118, ${opacity})`;  
    };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full overflow-x-auto font-sans bg-white dark:bg-gray-900">
      <table className="w-full border-collapse border-b-2 border-black dark:border-b-2 dark:border-white">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 border-b-2 border-black dark:border-b-2 dark:border-white text-sm">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-right">Away Team</th>
            <th className="p-2 text-right">Win Probability</th>
            <th className="p-2 text-center">@</th>
            <th className="p-2 text-left">Home Team</th>
            <th className="p-2 text-left">Win Probability</th>
            <th className="p-2 text-left">Game Excitement Score</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="p-2 text-sm">{formatDate(game.Date)}</td>
              <td className="p-2 text-sm text-right">{game.Visitor}</td>
              <td className="p-2 text-sm text-right" 
                  style={{ 
                    backgroundColor: getProbabilityColor(game.Visitor_Win_Likelihood),
                    // color: game.Visitor_Win_Likelihood > 75 ? 'white' : 'black'
                    color: isDarkMode ? 'white' : 'black'
                  }}>
                {game.Visitor_Win_Likelihood}%
              </td>
              <td className="p-2 text-sm text-center">@</td>
              <td className="p-2 text-sm">{game.Home}</td>
              <td className="p-2 text-sm border-r-2 border-r-black dark:border-r-white" 
                  style={{ 
                    backgroundColor: getProbabilityColor(game.Home_Win_Likelihood),
                    // color: game.Home_Win_Likelihood > 75 ? 'white' : 'black'
                    color: isDarkMode ? 'white' : 'black'
                  }}>
                {game.Home_Win_Likelihood}%
              </td>
              <td className="p-2 text-sm text-center w-60" 
                  style={{ 
                    backgroundColor: getExcitementColor(game.Game_Excitement_Score),
                    color: isDarkMode ? 'white' : 'black'
                  }}>
                {game.Game_Excitement_Score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs italic font-semibold">- Win Probabilities are calculated with a sigmoid function based on the balance of the two team's strength scores.</p>
      <p className="text-xs italic font-semibold">- "Game Excitement Score" is calculated as the geometric mean of both team's strength, prioritizing games with two strong teams and more uncertainty about the outcome.</p>
    </div>
  );
};

export default UpcomingGames;