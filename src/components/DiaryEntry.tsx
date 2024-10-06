import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { ja } from "date-fns/locale";
import { Home } from "lucide-react";

interface DiaryEntry {
  content: string;
  timestamp: number;
}

const DiaryEntry: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { date: locationDate, from } = location.state || {};
  const [date] = useState<Date>(
    locationDate ? new Date(locationDate) : new Date()
  );

  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 10000;

  useEffect(() => {
    const fetchExistingEntry = () => {
      try {
        const storedDiaries = localStorage.getItem("diaries");
        if (storedDiaries) {
          const diaries: DiaryEntry[] = JSON.parse(storedDiaries);
          const existingEntry = diaries.find((entry) =>
            isSameDay(new Date(entry.timestamp), date)
          );
          if (existingEntry) {
            setContent(existingEntry.content);
            setCharCount(existingEntry.content.length);
          } else {
            setContent("");
            setCharCount(0);
          }
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    };

    fetchExistingEntry();
  }, [date]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
      setCharCount(newContent.length);
    }
  };

  const saveDiary = () => {
    try {
      const newEntry: DiaryEntry = {
        content,
        timestamp: date.getTime(),
      };

      const storedDiaries = localStorage.getItem("diaries");
      const diaries: DiaryEntry[] = storedDiaries
        ? JSON.parse(storedDiaries)
        : [];

      const existingEntryIndex = diaries.findIndex((entry) =>
        isSameDay(new Date(entry.timestamp), date)
      );

      if (existingEntryIndex !== -1) {
        diaries[existingEntryIndex] = newEntry;
      } else {
        diaries.push(newEntry);
      }

      localStorage.setItem("diaries", JSON.stringify(diaries));
      navigate(from === "home" ? "/home" : "/calendar");
    } catch (error) {
      console.error("Error saving diary:", error);
      // ここでユーザーにエラーメッセージを表示するなどの処理を追加できます
    }
  };

  const handleCancel = () => {
    navigate(from === "home" ? "/home" : "/calendar");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-gray-200 rounded"
          >
            <Home size={24} />
          </button>
          <h1 className="text-2xl font-bold text-center">日記を書く</h1>
          <div className="w-10"></div> {/* Placeholder for alignment */}
        </div>
        <h2 className="text-xl font-bold mb-4">
          {format(date, "yyyy年M月d日", { locale: ja })}
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="diary-content" className="block mb-2 font-bold">
              今日感謝したこと：
            </label>
            <textarea
              id="diary-content"
              value={content}
              onChange={handleContentChange}
              rows={10}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="ここに日記を入力してください..."
            />
          </div>
          <p className="text-right text-sm text-gray-500">
            {charCount} / {MAX_CHARS}
          </p>
          <button
            onClick={saveDiary}
            className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            className="w-full p-3 bg-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-400"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntry;
