'use client';
import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

const NFLStatsTable = () => {
  const data = [
    { team: "Cleveland Browns", strength: 38.5, strengthChange: -0.9, record: "2-7", winPercentage: 22 },
    { team: "Las Vegas Raiders", strength: 36.4, strengthChange: 0.5, record: "2-7", winPercentage: 22 },
    { team: "Jacksonville Jaguars", strength: 32.9, strengthChange: -1.1, record: "2-8", winPercentage: 20 },
    { team: "Tampa Bay Buccaneers", strength: 52.0, strengthChange: -2.6, record: "4-6", winPercentage: 40 },
    { team: "Los Angeles Rams", strength: 54.3, strengthChange: -4.6, record: "4-5", winPercentage: 44 },
    { team: "San Francisco 49ers", strength: 65.2, strengthChange: 1.7, record: "5-4", winPercentage: 56 },
    { team: "Miami Dolphins", strength: 42.0, strengthChange: 5.6, record: "3-6", winPercentage: 33 },
    { team: "Cincinnati Bengals", strength: 47.3, strengthChange: -1.4, record: "4-6", winPercentage: 40 },
    { team: "New Orleans Saints", strength: 36.9, strengthChange: 5.0, record: "3-7", winPercentage: 30 },
    { team: "Seattle Seahawks", strength: 49.2, strengthChange: -0.4, record: "4-5", winPercentage: 44 },
    { team: "Tennessee Titans", strength: 26.5, strengthChange: -1.4, record: "2-7", winPercentage: 22 },
    { team: "New York Jets", strength: 33.7, strengthChange: -0.7, record: "3-7", winPercentage: 30 },
    { team: "Baltimore Ravens", strength: 73.5, strengthChange: 1.4, record: "7-3", winPercentage: 70 },
    { team: "Indianapolis Colts", strength: 43.3, strengthChange: -1.9, record: "4-6", winPercentage: 40 },
    { team: "Denver Broncos", strength: 50.5, strengthChange: 0.4, record: "5-5", winPercentage: 50 },
    { team: "Green Bay Packers", strength: 64.0, strengthChange: -0.7, record: "6-3", winPercentage: 67 },
    { team: "Houston Texans", strength: 55.2, strengthChange: -1.8, record: "6-4", winPercentage: 60 },
    { team: "Chicago Bears", strength: 39.3, strengthChange: -5.5, record: "4-5", winPercentage: 44 },
    { team: "Detroit Lions", strength: 83.5, strengthChange: 0.9, record: "8-1", winPercentage: 89 },
    { team: "New England Patriots", strength: 24.3, strengthChange: 5.9, record: "3-7", winPercentage: 30 },
    { team: "Kansas City Chiefs", strength: 93.6, strengthChange: 2.3, record: "9-0", winPercentage: 100 },
    { team: "Arizona Cardinals", strength: 51.6, strengthChange: 1.1, record: "6-4", winPercentage: 60 },
    { team: "Atlanta Falcons", strength: 50.7, strengthChange: -4.6, record: "6-4", winPercentage: 60 },
    { team: "Carolina Panthers", strength: 20.2, strengthChange: 5.4, record: "3-7", winPercentage: 30 },
    { team: "Buffalo Bills", strength: 69.3, strengthChange: 2.6, record: "8-2", winPercentage: 80 },
    { team: "Philadelphia Eagles", strength: 65.1, strengthChange: 1.3, record: "7-2", winPercentage: 78 },
    { team: "Minnesota Vikings", strength: 64.8, strengthChange: 0.4, record: "7-2", winPercentage: 78 },
    { team: "Pittsburgh Steelers", strength: 62.5, strengthChange: 1.6, record: "7-2", winPercentage: 78 },
    { team: "Los Angeles Chargers", strength: 50.4, strengthChange: 3.0, record: "6-3", winPercentage: 67 },
    { team: "Washington Commanders", strength: 47.0, strengthChange: -3.5, record: "7-3", winPercentage: 70 }
  ];

  type SortConfig = {
    key: keyof typeof data[0] | null;
    direction: 'ascending' | 'descending';
  };
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'ascending'
  });

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
    const opacity = strength / 100;
    return `rgba(108, 163, 219, ${opacity})`;
  };

  const getChangeColor = (change: number) => {
    console.log('Change:', change, 'Opacity:', Math.abs(change) / 10);
    const opacity = Math.abs(change) / 10;
    if (change > 0) return `rgba(171, 219, 118, ${opacity})`;
    if (change < 0) return `rgba(219, 118, 118, ${opacity})`;
    return '';
  };

  return (
    <div className="w-full overflow-x-auto font-sans">
      <table className="w-full border-collapse border-b-2 border-black">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-black text-sm">
            <th className="p-2 text-left cursor-pointer hover:bg-gray-200" onClick={() => sortData('team')}>
              <div className="flex items-center">
                Team <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => sortData('strength')}>
              <div className="flex items-center justify-end">
                Team Strength (1-100) <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => sortData('strengthChange')}>
              <div className="flex items-center justify-end">
                Change vs. Last Week <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => sortData('record')}>
              <div className="flex items-center justify-end">
                Record <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
            <th className="p-2 text-right cursor-pointer hover:bg-gray-200" onClick={() => sortData('winPercentage')}>
              <div className="flex items-center justify-end">
                Win % <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {getSortedData().map((team) => (
            <tr key={team.team} className="border-b hover:bg-gray-50">
              <td className="p-2 text-sm">{team.team}</td>
              <td className={`p-2 text-sm text-right`} 
                  style={{ 
                    backgroundColor: getStrengthColor(team.strength),
                    color: team.strength > 75 ? 'white' : 'black'
                  }}>
                {team.strength.toFixed(1)}
              </td>
              <td className="p-2 text-sm text-right" style={{ backgroundColor: getChangeColor(team.strengthChange) }}>
                {team.strengthChange > 0 ? '+' : ''}{team.strengthChange.toFixed(1)}
              </td>
              <td className="p-2 text-sm text-right">{team.record}</td>
              <td className="p-2 text-sm text-right">{team.winPercentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NFLStatsTable;