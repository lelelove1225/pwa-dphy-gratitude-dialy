import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DiaryEntry {
  content: string;
  timestamp: number;
}

const Home: React.FC = () => {
  const [recentEntries, setRecentEntries] = useState<DiaryEntry[]>([]);
  const [charCountData, setCharCountData] = useState<
    { day: string; count: number }[]
  >([]);
  const [challengeDays, setChallengeDays] = useState(0);

  useEffect(() => {
    const storedDiaries = localStorage.getItem("diaries");
    if (storedDiaries) {
      const diaries: DiaryEntry[] = JSON.parse(storedDiaries);

      diaries.sort((a, b) => b.timestamp - a.timestamp);
      setRecentEntries(diaries.slice(0, 3));
      setChallengeDays(diaries.length);

      const today = new Date();
      const twoWeeksAgo = new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000);

      const chartData = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(twoWeeksAgo.getTime() + i * 24 * 60 * 60 * 1000);
        const entry = diaries.find(
          (d) => new Date(d.timestamp).toDateString() === date.toDateString()
        );
        return {
          day: `day${(i + 1).toString().padStart(2, "0")}`,
          count: entry ? entry.content.length : 0,
        };
      });

      setCharCountData(chartData);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          日記継続{challengeDays}日目
        </h1>
        <p className="text-center mb-6">今日も頑張ろう！！</p>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">最近の日記</h2>
          {recentEntries.map((entry, index) => (
            <div key={index} className="mb-2">
              <p className="font-bold">
                {new Date(entry.timestamp).toLocaleDateString()}
              </p>
              <p>{entry.content.slice(0, 50)}...</p>
            </div>
          ))}
        </div>

        <div className="mb-6 h-80">
          <h2 className="text-xl font-bold mb-2">直近14日間の記入文字数</h2>
          <div className="w-full overflow-x-auto">
            {" "}
            {/* 横スクロール可能なコンテナを追加 */}
            <div className="w-[100%] h-[300px]">
              {" "}
              {/* グラフの幅を120%に設定 */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charCountData}
                  margin={{ top: 40, right: 30, left: -20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    interval={0}
                    tick={{
                      angle: -45,
                      textAnchor: "end",
                      dominantBaseline: "auto",
                      fontSize: 12,
                    }}
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/diary"
            className="block w-full p-3 bg-white border-2 border-black text-black text-center font-bold rounded-lg hover:bg-gray-100"
          >
            日記の作成
          </Link>
          <Link
            to="/calendar"
            className="block w-full p-3 bg-white border-2 border-black text-black text-center font-bold rounded-lg hover:bg-gray-100"
          >
            カレンダー
          </Link>
          <Link
            to="/settings"
            className="block w-full p-3 bg-white border-2 border-black text-black text-center font-bold rounded-lg hover:bg-gray-100"
          >
            設定
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
