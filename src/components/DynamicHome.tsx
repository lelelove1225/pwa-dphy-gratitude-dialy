import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ChevronLeft } from "lucide-react";

const DynamicHomeScreen = () => {
  const [currentDay, setCurrentDay] = useState(0);
  const [, setCurrentTask] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [taskLink, setTaskLink] = useState("");

  useEffect(() => {
    // TODO: Fetch the user's progress from the backend or local storage
    const fetchUserProgress = () => {
      // This is a placeholder. In a real app, you'd fetch the actual data.
      return {
        startDate: new Date("2023-09-01"),
        lastEntryDate: new Date("2023-09-03"),
      };
    };

    const userProgress = fetchUserProgress();
    const today = new Date();
    const daysSinceStart =
      Math.floor(
        (Number(today) - Number(userProgress.startDate)) / (1000 * 60 * 60 * 24)
      ) + 1;
    setCurrentDay(daysSinceStart);

    if (daysSinceStart === 1 || daysSinceStart === 14) {
      setCurrentTask("UWES Survey");
      setTaskLink("/worker-survey");
      setStatusMessage(
        daysSinceStart === 1
          ? "今日は初期状態のチェックをしましょう。"
          : "今日は感謝日記後のチェックをしましょう。"
      );
    } else {
      setCurrentTask("Diary Entry");
      setTaskLink("/home");
      setStatusMessage(`今日は感謝日記${daysSinceStart}日目です。`);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">ホーム画面</h1>
          <Link to="/settings" className="text-blue-500 hover:text-blue-700">
            <ChevronLeft className="inline-block mr-1" />
            戻る
          </Link>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              {statusMessage}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {format(new Date(), "yyyy年MM月dd日", { locale: ja })}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                ここからスタート！↓
              </h3>
              <div className="flex justify-center">
                <Link
                  to={taskLink}
                  className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded relative inline-block hover:bg-red-200 transition-colors duration-200 text-center"
                >
                  <strong className="font-bold">今日のタスク</strong>
                </Link>
              </div>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              過去の診断結果を確認する
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              現在のあなたのタスクが以下に太字で表示されています。
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li className={currentDay === 1 ? "font-bold" : ""}>
                初期状態のチェック
              </li>
              <li
                className={currentDay > 1 && currentDay < 14 ? "font-bold" : ""}
              >
                感謝日記の記録
              </li>
              <li className={currentDay === 14 ? "font-bold" : ""}>
                感謝日記後のチェック
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DynamicHomeScreen;
