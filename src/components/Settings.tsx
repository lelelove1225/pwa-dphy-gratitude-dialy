import { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  const [fontSize, setFontSize] = useState("medium");
  const [calendarStartDay, setCalendarStartDay] = useState("sunday");
  const [passcode, setPasscode] = useState("");
  const [language, setLanguage] = useState("japanese");

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem("settings") || "{}");
    setFontSize(savedSettings.fontSize || "medium");
    setCalendarStartDay(savedSettings.calendarStartDay || "sunday");
    setPasscode(savedSettings.passcode || "");
    setLanguage(savedSettings.language || "japanese");
  }, []);

  const saveSettings = () => {
    const settings = { fontSize, calendarStartDay, passcode, language };
    localStorage.setItem("settings", JSON.stringify(settings));
    alert("設定が保存されました");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="p-2 bg-gray-200 rounded">
          <Home size={24} />
        </Link>
        <h1 className="text-2xl font-bold">設定</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">日記本体の設定</h2>
          <div className="space-y-2">
            <div>
              <label className="block">文字の大きさ</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="small">小</option>
                <option value="medium">中</option>
                <option value="large">大</option>
              </select>
            </div>
            <div>
              <label className="block">カレンダーの開始曜日</label>
              <select
                value={calendarStartDay}
                onChange={(e) => setCalendarStartDay(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="sunday">日曜日</option>
                <option value="monday">月曜日</option>
              </select>
            </div>

            <div>
              <label className="block">多言語対応</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="japanese">日本語</option>
                <option value="english">English</option>
                <option value="chinese">中文</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">情報提供についての設定</h2>
          <div className="space-y-2">
            <Link
              to="/privacy-policy"
              className="block text-blue-600 hover:underline"
            >
              プライバシーポリシー
            </Link>
            <Link to="/contact" className="block text-blue-600 hover:underline">
              お問い合わせフォーム
            </Link>
            <Link to="/terms" className="block text-blue-600 hover:underline">
              利用規約
            </Link>
            <Link
              to="/test-info"
              className="block text-blue-600 hover:underline"
            >
              テスト項目の参照情報（AMS・UWES）
            </Link>
            <Link
              to="/data-sharing"
              className="block text-blue-600 hover:underline"
            >
              利用データの共有
            </Link>
          </div>
        </div>

        <button
          onClick={saveSettings}
          className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        >
          設定を保存
        </button>
      </div>
    </div>
  );
};

export default Settings;
