import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  isToday,
} from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface DiaryEntry {
  content: string;
  timestamp: number;
}

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [trophies, setTrophies] = useState({
    days3: false,
    days7: false,
    days10: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedDiaries = localStorage.getItem("diaries");
    if (storedDiaries) {
      const parsedDiaries = JSON.parse(storedDiaries);
      setDiaryEntries(parsedDiaries);
      updateTrophies(parsedDiaries);
    }
  }, []);

  const updateTrophies = (entries: DiaryEntry[]) => {
    const sortedEntries = entries.sort((a, b) => a.timestamp - b.timestamp);
    let maxStreak = 0;
    let currentStreak = 0;
    let prevDate: Date | null = null;

    sortedEntries.forEach((entry) => {
      const entryDate = new Date(entry.timestamp);
      if (prevDate && isSameDay(addDays(prevDate, 1), entryDate)) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
      prevDate = entryDate;
    });

    setTrophies({
      days3: maxStreak >= 3,
      days7: maxStreak >= 7,
      days10: maxStreak >= 10,
    });
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    const entry = diaryEntries.find((entry) =>
      isSameDay(new Date(entry.timestamp), day)
    );
    setSelectedEntry(entry || null);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Link to="/" className="p-2 bg-gray-200 rounded">
          <Home size={24} />
        </Link>
        <div className="flex items-center">
          <button
            onClick={() =>
              setCurrentMonth(
                (prevMonth) =>
                  new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1)
              )
            }
          >
            <ChevronLeft />
          </button>
          <h2 className="text-xl font-bold mx-4">
            {format(currentMonth, "yyyy年 M月", { locale: ja })}
          </h2>
          <button
            onClick={() =>
              setCurrentMonth(
                (prevMonth) =>
                  new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1)
              )
            }
          >
            <ChevronRight />
          </button>
        </div>
        <div className="w-10"></div> {/* Placeholder for alignment */}
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEEE";
    const days = [];
    const startDate = startOfMonth(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="font-bold text-center">
          {format(
            new Date(startDate.getFullYear(), startDate.getMonth(), i + 1),
            dateFormat,
            { locale: ja }
          )}
        </div>
      );
    }

    return <div className="grid grid-cols-7 gap-1 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      monthStart.getDate() - monthStart.getDay() + 1
    );
    const endDate = new Date(
      monthEnd.getFullYear(),
      monthEnd.getMonth(),
      monthEnd.getDate() + (7 - monthEnd.getDay())
    );

    const dateFormat = "d";
    const rows = [];

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const formattedDays = days.map((day) => {
      const hasEntry = diaryEntries.some((entry) =>
        isSameDay(new Date(entry.timestamp), day)
      );
      const isSelectedDate = isSameDay(day, selectedDate);
      const isCurrentDate = isToday(day);
      const isEditableDate =
        isSameDay(day, new Date()) || isSameDay(day, addDays(new Date(), -1));
      return (
        <div
          key={day.toString()}
          className={`p-2 border text-center cursor-pointer
            ${!isSameMonth(day, monthStart) ? "text-gray-400" : ""}
            ${isSelectedDate ? "bg-blue-100" : ""}
            ${isCurrentDate ? "bg-yellow-100" : ""}
            ${hasEntry ? "border-b-4 border-b-green-500" : ""}
            ${isEditableDate ? "border-red-500" : ""}
          `}
          onClick={() => onDateClick(day)}
        >
          <span>{format(day, dateFormat)}</span>
        </div>
      );
    });

    for (let i = 0; i < formattedDays.length; i += 7) {
      rows.push(
        <div key={i} className="grid grid-cols-7 gap-1">
          {formattedDays.slice(i, i + 7)}
        </div>
      );
    }

    return <div className="mb-4">{rows}</div>;
  };

  const handleEditDiary = () => {
    if (selectedEntry) {
      navigate("/diary", { state: { date: selectedDate, from: "calendar" } });
    } else {
      navigate("/diary", {
        state: { date: selectedDate, isNewEntry: true, from: "calendar" },
      });
    }
  };

  const isEditableDate =
    isSameDay(selectedDate, new Date()) ||
    isSameDay(selectedDate, addDays(new Date(), -1));

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <p className="mb-2 text-sm">
        こちらの画面では、当日と前日の日記に限り日記の編集が可能です。
      </p>
      <button
        onClick={handleEditDiary}
        className={`w-full p-2 ${
          isEditableDate
            ? "bg-blue-500 text-white"
            : "bg-gray-300 text-gray-600"
        } rounded mb-4`}
        disabled={!isEditableDate}
      >
        日記の編集
      </button>
      {selectedEntry && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold mb-2">
            {format(selectedDate, "yyyy年M月d日", { locale: ja })}
          </h3>
          <p>{selectedEntry.content}</p>
        </div>
      )}
      <div className="mt-4">
        <h3 className="font-bold mb-2">獲得したトロフィー</h3>
        <ul>
          {trophies.days3 && <li>🏆 3日間記入達成</li>}
          {trophies.days7 && <li>🏆 7日間記入達成</li>}
          {trophies.days10 && <li>🏆 10日間記入達成</li>}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
