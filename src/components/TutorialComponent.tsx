import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TutorialStep {
  title: string;
  content: React.ReactNode;
}

const TutorialSteps: TutorialStep[] = [
  {
    title: "アプリについて",
    content: (
      <>
        <p>
          これは、「日々の感謝を記録することがモチベーションを向上させる」という立命館大学と国立研究開発法人情報通信研究機構による研究結果に基づき開発された二週間の感謝日記アプリです。感謝日記を二週間つけることによる、ご自身のモチベーションの変化を体験してみてください。
        </p>
      </>
    ),
  },
  {
    title: "初期状態のチェック",
    content: (
      <>
        <p>
          感謝日記を始める前の、モチベーションの状態をチェックしてみましょう。複数の質問が出てきますので、当てはまる回答を選んでください。結果は次のように現れます。
        </p>
        <div className="flex justify-around mt-4">
          <div>
            <p className="text-center mb-2">
              学生用：
              <br />
              学習モチベーション
            </p>
            <img
              src="/api/placeholder/150/150"
              alt="学習モチベーションチャート"
              className="mx-auto"
            />
          </div>
          <div>
            <p className="text-center mb-2">
              社会人用：
              <br />
              ワークエンゲージメント
            </p>
            <img
              src="/api/placeholder/150/150"
              alt="ワークエンゲージメントチャート"
              className="mx-auto"
            />
          </div>
        </div>
      </>
    ),
  },
  {
    title: "感謝日記の記録（二週間）",
    content: (
      <p>
        感謝日記をつける期間は二週間です。毎日、その日に感謝を感じたことを2,3個書いてみましょう。一日に一回、感謝に注意を向けることが大切です。なるべく期間中は毎日、感謝日記をつけてください。
      </p>
    ),
  },
  {
    title: "感謝日記後のチェック",
    content: (
      <p>
        感謝日記をつけた後のモチベーションの状態をチェックしてみましょう。初期状態のチェックと同じ質問です。さて、何か変化は見られたでしょうか。
      </p>
    ),
  },
  {
    title: "アプリの説明は以上です",
    content: <p>感謝日記をつけることによる、心の変化を体験してみましょう。</p>,
  },
];

const TutorialComponent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    if (currentStep < TutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        {TutorialSteps[currentStep].title}
      </h1>
      <div className="mb-4">{TutorialSteps[currentStep].content}</div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          {currentStep + 1} / {TutorialSteps.length}
        </div>
        {currentStep < TutorialSteps.length - 1 ? (
          <button onClick={goToNextStep} className="p-2 bg-gray-200 rounded">
            <ChevronRight size={24} />
          </button>
        ) : (
          <button
            onClick={() => alert("アプリを開始します！")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            スタート！
          </button>
        )}
      </div>
    </div>
  );
};

export default TutorialComponent;
