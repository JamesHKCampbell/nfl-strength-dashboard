'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';

interface TeamStats {
  team: string;
  strength: number;
  strengthChange: number;
  record: string;
  winPercentage: number;
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
    key: null,
    direction: 'ascending'
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

  return (
    <div className="w-full overflow-x-auto font-sans bg-white dark:bg-gray-900">
      <table className="w-full border-collapse border-b-2 border-black dark:border-b-2 dark:border-white">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 border-b border-black dark:border-b-2 dark:border-white text-sm">
            <th className="p-2 text-left cursor-pointer" onClick={() => sortData('team')}>
              <div className="flex items-center">
                Team <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => sortData('strength')}>
              <div className="flex items-center justify-end">
                Team Strength (1-100) <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => sortData('strengthChange')}>
              <div className="flex items-center justify-end">
                Change vs. Last Week <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => sortData('record')}>
              <div className="flex items-center justify-end">
                Record <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer" onClick={() => sortData('winPercentage')}>
              <div className="flex items-center justify-end">
                Win % <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {getSortedData().map((team) => (
            <tr key={team.team} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="p-2 text-right border dark:border-gray-600 dark:hover:bg-gray-700 text-sm">{team.team}</td>
              <td className={`p-2 border dark:border-gray-600 dark:hover:bg-gray-700 text-sm text-right`} 
                  style={{ 
                    backgroundColor: getStrengthColor(team.strength),
                    color: isDarkMode ? 'white' : (team.strength > 75 ? 'white' : 'black')
                  }}>
                {team.strength.toFixed(1)}
              </td>
              <td className="p-2 text-sm text-right border dark:border-gray-600 dark:hover:bg-gray-700" style={{ backgroundColor: getChangeColor(team.strengthChange) }}>
                {team.strengthChange > 0 ? '+' : ''}{team.strengthChange.toFixed(1)}
              </td>
              <td className="p-2 text-sm text-right border dark:border-gray-600 dark:hover:bg-gray-700">{team.record}</td>
              <td className="p-2 text-sm text-right border dark:border-gray-600 dark:hover:bg-gray-700">{team.winPercentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NFLStatsTable;