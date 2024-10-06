import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  isSameDay,
  isYesterday,
  subDays,
  differenceInDays,
} from "date-fns";
import { ja } from "date-fns/locale";

interface DiaryEntry {
  content: string;
  timestamp: number;
}

const Home: React.FC = () => {
  const [recentEntries, setRecentEntries] = useState<DiaryEntry[]>([]);
  const [charCountData, setCharCountData] = useState<
    { date: string; count: number }[]
  >([]);
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const navigate = useNavigate();

  const loadDiaryData = () => {
    const storedDiaries = localStorage.getItem("diaries");
    if (storedDiaries) {
      const diaries: DiaryEntry[] = JSON.parse(storedDiaries);

      // Sort diaries by timestamp in descending order
      diaries.sort((a, b) => b.timestamp - a.timestamp);
      setRecentEntries(diaries.slice(0, 3));

      // Calculate consecutive days
      let count = 0;
      const today = new Date();
      for (let i = 0; i < diaries.length; i++) {
        const entryDate = new Date(diaries[i].timestamp);
        if (i === 0) {
          if (isSameDay(entryDate, today) || isYesterday(entryDate)) {
            count++;
          } else {
            break;
          }
        } else {
          const prevEntryDate = new Date(diaries[i - 1].timestamp);
          if (differenceInDays(prevEntryDate, entryDate) === 1) {
            count++;
          } else {
            break;
          }
        }
      }
      setConsecutiveDays(count);

      // Prepare chart data
      const chartData = Array.from({ length: 14 }, (_, i) => {
        const date = subDays(today, 13 - i);
        const entry = diaries.find((d) =>
          isSameDay(new Date(d.timestamp), date)
        );
        return {
          date: format(date, "M/d", { locale: ja }),
          count: entry ? entry.content.length : 0,
        };
      });

      setCharCountData(chartData);
    }
  };

  useEffect(() => {
    loadDiaryData();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path, { state: { from: "home" } });
  };

  const handleReset = () => {
    if (
      window.confirm(
        "本当に全ての日記を削除してゼロ日目からやり直しますか？この操作は取り消せません。"
      )
    ) {
      localStorage.removeItem("diaries");
      setRecentEntries([]);
      setCharCountData(Array(14).fill({ date: "", count: 0 }));
      setConsecutiveDays(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          日記継続{consecutiveDays}日目
        </h1>
        <p className="text-center mb-6">今日も頑張ろう！！</p>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">最近の日記</h2>
          {recentEntries.length > 0 ? (
            recentEntries.map((entry, index) => (
              <div key={index} className="mb-2">
                <p className="font-bold">
                  {format(new Date(entry.timestamp), "yyyy年M月d日", {
                    locale: ja,
                  })}
                </p>
                <p>{entry.content.slice(0, 50)}...</p>
              </div>
            ))
          ) : (
            <p>まだ日記がありません。新しい日記を書いてみましょう！</p>
          )}
        </div>

        <div className="mb-6 h-80">
          <h2 className="text-xl font-bold mb-2">直近14日間の記入文字数</h2>
          <div className="w-full overflow-x-auto">
            <div className="w-[100%] h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={charCountData}
                  margin={{ top: 40, right: 30, left: -20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
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
          <button
            onClick={() => handleNavigation("/diary")}
            className="w-full p-3 bg-white border-2 border-black text-black text-center font-bold rounded-lg hover:bg-gray-100"
          >
            日記の作成
          </button>
          <button
            onClick={() => handleNavigation("/calendar")}
            className="w-full p-3 bg-white border-2 border-black text-black text-center font-bold rounded-lg hover:bg-gray-100"
          >
            カレンダー
          </button>
          <button
            onClick={() => handleNavigation("/settings")}
            className="w-full p-3 bg-white border-2 border-black text-black text-center font-bold rounded-lg hover:bg-gray-100"
          >
            設定
          </button>
          <button
            onClick={handleReset}
            className="w-full p-3 bg-red-500 text-white text-center font-bold rounded-lg hover:bg-red-600"
          >
            全てリセット
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
