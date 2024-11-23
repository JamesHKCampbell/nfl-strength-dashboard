'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface TeamStats {
  team: string;
  strength: number;
  strengthChange: number;
  record: string;
  winPercentage: number;
  prob_makePlayoffs: number;
  prob_winDivision: number;
  prob_winSuperbowl: number;
}

const NFLStatsTable = () => {
  const [data, setData] = useState<TeamStats[]>([]);  // Add type here

  useEffect(() => {
    fetch('/data/nfl-team-strength-output.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  type SortConfig = {
    key: keyof TeamStats | null;
    direction: 'ascending' | 'descending';
  };
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'strength',
    direction: 'descending'
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  const sortData = (key: keyof typeof data[0]) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const getStrengthColor = (strength: number) => {
    const opacity = strength / 90;
    if (isDarkMode == true) return `rgba(36, 92, 148, ${opacity})`;
    if (isDarkMode == false) return `rgba(108, 163, 219, ${opacity})`;
    return ''
  };

  const getChangeColor = (change: number) => {
    console.log('Change:', change, 'Opacity:', Math.abs(change) / 10);
    const opacity = isDarkMode ? Math.abs(change) / 10 : Math.abs(change) / 10;
    if (change > 0) return `rgba(171, 219, 118, ${opacity})`;
    if (change < 0) return `rgba(219, 118, 118, ${opacity})`;
    return '';
  };

  const getProbColor = (prob: number) => {
    if (prob === 100) {
        return isDarkMode ? 'rgba(92, 42, 141, 1)' : 'rgba(61, 30, 92, 1)';  // Brighter purple
    }
    const opacity = (prob+10) / 100;
    if (isDarkMode) return `rgba(92, 42, 141, ${opacity})`;
    return `rgba(163, 114, 213, ${opacity})`;
  };
  
  return (
    <div className="w-full overflow-x-auto font-sans bg-white dark:bg-gray-900">
      <table className="w-full border-collapse border-b-2 border-black dark:border-b-2 dark:border-white">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 border-b-2 border-black dark:border-b-2 dark:border-white text-sm">
            <th className="p-2 text-left cursor-pointer" onClick={() => sortData('team')}>
              <div className="flex items-center">
                Team <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-left cursor-pointer" onClick={() => sortData('division')}>
              <div className="flex items-center">
                Division <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => sortData('strength')}>
              <div className="flex items-center justify-end">
                Team Strength<br />(1-100) <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer border-r-2 border-r-black dark:border-r-white" onClick={() => sortData('strengthChange')}>
              <div className="flex items-center justify-end">
                Change in Strength<br />(vs. Last Week) <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => sortData('record')}>
              <div className="flex items-center justify-end">
                Record <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer border-r-2 border-r-black dark:border-r-white" onClick={() => sortData('winPercentage')}>
              <div className="flex items-center justify-end">
                Win % <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => sortData('prob_makePlayoffs')}>
              <div className="flex items-center justify-end">
                Probability to:<br /> Make Playoffs <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => sortData('prob_winDivision')}>
              <div className="flex items-center justify-end">
                Probability to:<br /> Win Division <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => sortData('prob_winSuperbowl')}>
              <div className="flex items-center justify-end">
                Probability to:<br /> Win Super Bowl <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {getSortedData().map((team) => (
            <tr key={team.team} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="p-2 text-right border dark:border-gray-600 dark:hover:bg-gray-700 text-sm">{team.team}</td>
              <td className="p-2 text-right border dark:border-gray-600 dark:hover:bg-gray-700 text-sm">{team.division}</td>
              <td className={`p-2 border dark:border-gray-600 dark:hover:bg-gray-700 text-sm text-right`} 
                  style={{ 
                    backgroundColor: getStrengthColor(team.strength),
                    color: isDarkMode ? 'white' : (team.strength > 75 ? 'white' : 'black')
                  }}>
                {team.strength.toFixed(1)}
              </td>
              <td className="p-2 text-sm text-right border border-r-2 border-r-black dark:border-r-white dark:border-gray-600 dark:hover:bg-gray-700" style={{ backgroundColor: getChangeColor(team.strengthChange) }}>
                {team.strengthChange > 0 ? '+' : ''}{team.strengthChange.toFixed(1)}
              </td>
              <td className="p-2 text-sm text-right border dark:border-gray-600 dark:hover:bg-gray-700">{team.record}</td>
              <td className="p-2 text-sm text-right border border-r-2 border-r-black dark:border-r-white dark:border-gray-600 dark:hover:bg-gray-700">{team.winPercentage}%</td>
              <td className="p-2 text-sm text-right border dark:border-gray-600 dark:hover:bg-gray-700"
                  style={{ 
                    backgroundColor: getProbColor(team.prob_makePlayoffs),
                    color: isDarkMode ? 'white' : (team.prob_makePlayoffs > 75 ? 'white' : 'black'),
                    fontWeight: team.prob_makePlayoffs === 100 ? 'bold' : 'normal'
                  }}>
                {team.prob_makePlayoffs}%
              </td>
              <td className="p-2 text-sm text-right border dark:border-gray-600 dark:hover:bg-gray-700"
                  style={{ 
                    backgroundColor: getProbColor(team.prob_winDivision),
                    color: isDarkMode ? 'white' : (team.prob_winDivision > 75 ? 'white' : 'black'),
                    fontWeight: team.prob_winDivision === 100 ? 'bold' : 'normal'
                  }}>
                {team.prob_winDivision}%
              </td>
              <td className="p-2 text-sm text-right border dark:border-gray-600 dark:hover:bg-gray-700"
                  style={{ 
                    backgroundColor: getProbColor(team.prob_winSuperbowl),
                    color: isDarkMode ? 'white' : (team.prob_winSuperbowl > 75 ? 'white' : 'black'),
                    fontWeight: team.prob_winSuperbowl === 100 ? 'bold' : 'normal'
                  }}>
                {team.prob_winSuperbowl}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NFLStatsTable;