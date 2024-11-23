'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Select from 'react-select';

interface TimeSeriesData {
  _cutoffDate: string;
  team: string;
  strength: number;
}

interface TeamOption {
  value: string;
  label: string;
}

const TeamTrends = () => {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<TeamOption[]>([]);
  const [teamOptions, setTeamOptions] = useState<TeamOption[]>([]);

  // Load time series data
  useEffect(() => {
    fetch('/data/nfl-team-strength-timeseries.json')
      .then(response => response.json())
      .then(data => {
        setData(data);
        // Get unique teams for the dropdown
        const teams = [...new Set(data.map((d: TimeSeriesData) => d.team))];
        setTeamOptions(teams.map(team => ({ value: team, label: team })));
      })
      .catch(error => console.error('Error loading time series data:', error));
  }, []);

  // Colors for different teams
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

  // Process data for the chart
  const processedData = data.reduce((acc: any[], curr) => {
    const existingDate = acc.find(d => d._cutoffDate === curr._cutoffDate);
    if (existingDate) {
      existingDate[curr.team] = curr.strength;
    } else {
      const newDate = { _cutoffDate: curr._cutoffDate };
      newDate[curr.team] = curr.strength;
      acc.push(newDate);
    }
    return acc;
  }, []);

  return (
    <div className="w-full p-4">
      <div className="mb-4">
        <Select
          isMulti
          options={teamOptions}
          value={selectedTeams}
          onChange={(selected) => setSelectedTeams(selected as TeamOption[])}
          className="w-full max-w-xl"
          placeholder="Select teams to compare (max 5)"
          isOptionDisabled={() => selectedTeams.length >= 5}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <LineChart
          width={800}
          height={400}
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="_cutoffDate" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis domain={[0, 100]} />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            formatter={(value: number) => [value.toFixed(1), "Strength"]}
          />
          <Legend />
          {selectedTeams.map((team, index) => (
            <Line
              key={team.value}
              type="monotone"
              dataKey={team.value}
              stroke={colors[index]}
              dot={false}
              name={team.label}
            />
          ))}
        </LineChart>
      </div>
    </div>
  );
};

export default TeamTrends;