import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const TermsOfService = () => (
  <div className="terms-of-service bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto text-sm">
    <h2 className="text-lg font-bold mb-4">利用規約</h2>
    <h3 className="font-semibold mb-2">1. はじめに</h3>
    <p className="mb-2">
      この利用規約（以下、「本規約」といいます。）は、当社が提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。
    </p>

    <h3 className="font-semibold mb-2">2. 利用登録</h3>
    <p className="mb-2">
      登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
    </p>

    <h3 className="font-semibold mb-2">3. 禁止事項</h3>
    <p className="mb-2">
      ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
    </p>
    <ul className="list-disc list-inside mb-2">
      <li>法令または公序良俗に違反する行為</li>
      <li>犯罪行為に関連する行為</li>
      <li>
        当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
      </li>
    </ul>

    <h3 className="font-semibold mb-2">4. 本サービスの提供の停止等</h3>
    <p className="mb-2">
      当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
    </p>

    {/* 他の条項も同様に追加 */}
  </div>
);

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [occupation, setOccupation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeToTerms) {
      setError("個人情報関連の文言に同意してください。");
      return;
    }
    if (!occupation) {
      setError("職業を選択してください。");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError("アカウント作成に失敗しました。もう一度お試しください。");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          新規登録
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                ログインID（メールアドレス）
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                使用できる単語は英小文字・英大文字・英数字の3種類です。8文字以上32文字以下で入力してください。
              </p>
            </div>

            <div>
              <label
                htmlFor="terms"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                利用規約
              </label>
              <TermsOfService />
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-gray-900"
              >
                利用規約と個人情報関連の文言に同意する
              </label>
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700">
                あなたの職業は？
              </span>
              <div className="mt-2 space-y-2">
                {["大学生・大学院生", "社会人", "その他"].map((opt) => (
                  <div className="flex items-center" key={opt}>
                    <input
                      id={opt}
                      name="occupation"
                      type="radio"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      value={opt}
                      checked={occupation === opt}
                      onChange={(e) => setOccupation(e.target.value)}
                    />
                    <label
                      htmlFor={opt}
                      className="ml-2 block text-sm text-gray-900"
                    >
                      {opt}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                アカウントを作成
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
