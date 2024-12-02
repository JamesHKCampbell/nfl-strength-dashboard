import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Check, X } from 'lucide-react';

interface TeamData {
  strength: number;
  winPercentage: number;
}

interface DataPoint {
  _cutoffDate: string;
  [team: string]: TeamData | string;
}

interface RawDataPoint {
  _cutoffDate: string;
  Team: string;
  Strength: number;
  "Win %": number;
}

interface TeamColors {
  [team: string]: string;
}

const TeamTrends = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(["Baltimore Ravens"]);
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    fetch('/data/nfl-team-strength-time-series.json')
      .then(response => response.json())
      .then((jsonData: RawDataPoint[]) => {
        const processedData = jsonData.reduce((acc: DataPoint[], curr) => {
          const existingDate = acc.find(d => d._cutoffDate === curr._cutoffDate);
          if (existingDate) {
            existingDate[curr.Team] = {
              strength: curr.Strength,
              winPercentage: curr["Win %"] * 100
            };
          } else {
            const newDate: DataPoint = { _cutoffDate: curr._cutoffDate };
            newDate[curr.Team] = {
              strength: curr.Strength,
              winPercentage: curr["Win %"] * 100
            };
            acc.push(newDate);
          }
          return acc;
        }, []);

        const teams = [...new Set(jsonData.map(item => item.Team))];
        setAllTeams(teams);
        setData(processedData);
      })
      .catch(error => console.error('Error loading data:', error));
  }, []);

  const toggleTeam = (team: string) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter(t => t !== team));
    } else if (selectedTeams.length < 5) {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const teamColors: TeamColors = {
    "Arizona Cardinals": "#97233F",
    "Atlanta Falcons": "#A71930",
    "Baltimore Ravens": "#241773",
    "Buffalo Bills": "#00338D",
    "Carolina Panthers": "#0085CA",
    "Chicago Bears": "#0B162A",
    "Cincinnati Bengals": "#FB4F14",
    "Cleveland Browns": "#311D00",
    "Dallas Cowboys": "#003594",
    "Denver Broncos": "#FB4F14",
    "Detroit Lions": "#0076B6",
    "Green Bay Packers": "#203731",
    "Houston Texans": "#03202F",
    "Indianapolis Colts": "#002C5F",
    "Jacksonville Jaguars": "#101820",
    "Kansas City Chiefs": "#E31837",
    "Las Vegas Raiders": "#000000",
    "Los Angeles Chargers": "#0080C6",
    "Los Angeles Rams": "#003594",
    "Miami Dolphins": "#008E97",
    "Minnesota Vikings": "#4F2683",
    "New England Patriots": "#002244",
    "New Orleans Saints": "#101820",
    "New York Giants": "#0B2265",
    "New York Jets": "#125740",
    "Philadelphia Eagles": "#004C54",
    "Pittsburgh Steelers": "#FFB612",
    "San Francisco 49ers": "#AA0000",
    "Seattle Seahawks": "#002244",
    "Tampa Bay Buccaneers": "#D50A0A",
    "Tennessee Titans": "#0C2340",
    "Washington Commanders": "#773141"
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const divisions = {
    "AFC North": ["Baltimore Ravens", "Cincinnati Bengals", "Cleveland Browns", "Pittsburgh Steelers"],
    "AFC South": ["Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Tennessee Titans"],
    "AFC East": ["Buffalo Bills", "Miami Dolphins", "New England Patriots", "New York Jets"],
    "AFC West": ["Denver Broncos", "Kansas City Chiefs", "Las Vegas Raiders", "Los Angeles Chargers"],
    "NFC North": ["Chicago Bears", "Detroit Lions", "Green Bay Packers", "Minnesota Vikings"],
    "NFC South": ["Atlanta Falcons", "Carolina Panthers", "New Orleans Saints", "Tampa Bay Buccaneers"],
    "NFC East": ["Dallas Cowboys", "New York Giants", "Philadelphia Eagles", "Washington Commanders"],
    "NFC West": ["Arizona Cardinals", "Los Angeles Rams", "San Francisco 49ers", "Seattle Seahawks"]
  };

  return (
    <div className="w-full p-4 font-sans border-b-2 border-black dark:border-white">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Select Teams to Compare (max 5)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          {Object.entries(divisions).map(([division, teams]) => (
            <div key={division} className="p-3 border rounded-md dark:border-gray-700">
              <h4 className="font-bold mb-2 text-sm">{division}</h4>
              <div className="flex flex-col gap-1">
                {teams.map((team: string) => (
                  <button
                    key={team}
                    onClick={() => toggleTeam(team)}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center justify-between ${
                      selectedTeams.includes(team)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    } ${selectedTeams.length >= 5 && !selectedTeams.includes(team) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {team}
                    {selectedTeams.includes(team) ? (
                      <Check className="w-4 h-4 ml-2" />
                    ) : (
                      <X className="w-4 h-4 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-[600px]">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="_cutoffDate" 
              tickFormatter={formatDate}
              stroke={isDarkMode ? "#fff" : "#000"}
            />
            <YAxis 
              yAxisId="strength" 
              domain={[0, 100]} 
              label={{ 
                value: 'Team Strength', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: isDarkMode ? "#fff" : "#000" }
              }}
              stroke={isDarkMode ? "#fff" : "#000"}
            />
            <YAxis 
              yAxisId="winPercentage" 
              orientation="right" 
              domain={[0, 100]}
              label={{ 
                value: 'Win %', 
                angle: 90, 
                position: 'insideRight',
                style: { fill: isDarkMode ? "#fff" : "#000" }
              }}
              stroke={isDarkMode ? "#fff" : "#000"}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? "#374151" : "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                color: isDarkMode ? "#fff" : "#000",
                fontSize: "14px"
              }}
              formatter={(value: number, name: string) => {
                const team = name.split(" [")[0];
                const metric = name.includes("Win %") ? "Win %" : "Strength";
                return [
                  `${value.toFixed(1)}${metric === "Win %" ? "%" : ""}`,
                  `${team} - ${metric}`
                ];
              }}              
              labelFormatter={formatDate}
            />
            <Legend />
            {selectedTeams.map((team: string) => (
              <React.Fragment key={team}>
                <Line
                  type="monotone"
                  dataKey={(item: DataPoint) => (item[team] as TeamData)?.strength}
                  stroke={teamColors[team]}
                  name={`${team} [Strength]`}
                  yAxisId="strength"
                  strokeWidth={2}
                  dot={true}
                />
                <Line
                  type="monotone"
                  dataKey={(item: DataPoint) => (item[team] as TeamData)?.winPercentage}
                  stroke={teamColors[team]}
                  name={`${team} [Win %]`}
                  yAxisId="winPercentage"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                  dot={false}
                />
              </React.Fragment>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeamTrends;