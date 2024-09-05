import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DiaryEntry {
  content: string;
  timestamp: number;
}

const DiaryEntry: React.FC = () => {
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const navigate = useNavigate();
  const MAX_CHARS = 10000;

  useEffect(() => {
    const loadLatestDiary = () => {
      const storedDiaries = localStorage.getItem("diaries");
      if (storedDiaries) {
        const diaries: DiaryEntry[] = JSON.parse(storedDiaries);
        if (diaries.length > 0) {
          const latestDiary = diaries[diaries.length - 1];
          setContent(latestDiary.content);
        }
      }
    };

    loadLatestDiary();
  }, []);

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  useEffect(() => {
    const saveDiary = () => {
      const newEntry: DiaryEntry = {
        content,
        timestamp: Date.now(),
      };

      const storedDiaries = localStorage.getItem("diaries");
      const diaries: DiaryEntry[] = storedDiaries
        ? JSON.parse(storedDiaries)
        : [];

      // 同じ日の日記がある場合は上書き、なければ新規追加
      const today = new Date().toDateString();
      const existingEntryIndex = diaries.findIndex(
        (entry) => new Date(entry.timestamp).toDateString() === today
      );

      if (existingEntryIndex !== -1) {
        diaries[existingEntryIndex] = newEntry;
      } else {
        diaries.push(newEntry);
      }

      localStorage.setItem("diaries", JSON.stringify(diaries));
    };

    const timeoutId = setTimeout(saveDiary, 1000); // 1秒後に保存

    return () => clearTimeout(timeoutId);
  }, [content]);

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">日記を書く</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="diary-content" className="block mb-2 font-bold">
              今日感謝したこと：
            </label>
            <textarea
              id="diary-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={MAX_CHARS}
              rows={10}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="ここに日記を入力してください..."
            />
          </div>
          <p className="text-right text-sm text-gray-500">
            {charCount} / {MAX_CHARS}
          </p>
          <button
            onClick={handleNavigateHome}
            className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntry;
