import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  text: string;
}

interface Answers {
  [key: number]: number;
}

interface Errors {
  [key: number]: string;
}

const questions: Question[] = [
  { id: 1, text: "仕事をしていると、活力がみなぎるように感じる。(活力1)" },
  { id: 2, text: "自分の仕事に、意義や価値を大いに感じる。(熱意1)" },
  { id: 3, text: "仕事をしていると、時間がたつのが速い。(没頭1)" },
  { id: 4, text: "職場では、元気が出て精力的になるように感じる。(活力2)" },
  { id: 5, text: "仕事に熱心である。(熱意2)" },
  { id: 6, text: "仕事をしていると、他のことはすべて忘れてしまう。(没頭2)" },
  { id: 7, text: "仕事は、私に活力を与えてくれる。(熱意3)" },
  {
    id: 8,
    text: "朝に目がさめると、さあ仕事へ行こう、という気持ちになる。(活力3)",
  },
  { id: 9, text: "仕事に没頭しているとき、幸せだと感じる。(没頭3)" },
  { id: 10, text: "自分の仕事に誇りを感じる。(熱意4)" },
  { id: 11, text: "私は仕事にのめり込んでいる。(没頭4)" },
  { id: 12, text: "長時間休まずに、働き続けることができる。(活力4)" },
  { id: 13, text: "私にとって仕事は、意欲をかきたてるものである。(熱意5)" },
  { id: 14, text: "仕事をしていると、つい夢中になってしまう。(没頭5)" },
  { id: 15, text: "職場では、気持ちがはつらつとしている。(活力5)" },
  { id: 16, text: "仕事から頭を切り離すのが難しい。(没頭6)" },
  {
    id: 17,
    text: "ことがうまく運んでいないときでも、粘り強く仕事をする。(活力6)",
  },
];

interface QuestionSetProps {
  questions: Question[];
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  errors: Errors;
}

const QuestionSet: React.FC<QuestionSetProps> = ({
  questions,
  answers,
  setAnswers,
  errors,
}) => {
  const handleChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <>
      {questions.map((question) => (
        <div key={question.id} className="mb-6">
          <p className="mb-2">{question.text}</p>
          <div className="flex flex-wrap justify-between">
            {[0, 1, 2, 3, 4, 5, 6].map((value) => (
              <label key={value} className="flex flex-col items-center mb-2">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={value}
                  checked={answers[question.id] === value}
                  onChange={() => handleChange(question.id, value)}
                  className="mb-1"
                />
                <span className="text-xs text-center">
                  {
                    [
                      "全くない",
                      "ほとんど感じない",
                      "めったに感じない",
                      "時々感じる",
                      "よく感じる",
                      "とてもよく感じる",
                      "いつも感じる",
                    ][value]
                  }
                </span>
              </label>
            ))}
          </div>
          {errors[question.id] && (
            <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
          )}
        </div>
      ))}
    </>
  );
};

const WorkerSurvey: React.FC = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [errors, setErrors] = useState<Errors>({});
  const [version, setVersion] = useState<"3" | "9" | "17">("17");

  useEffect(() => {
    // バージョンが変更されたときにエラーをリセット
    setErrors({});
  }, [version]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuestions = getQuestions();
    const newErrors: Errors = {};
    currentQuestions.forEach((question) => {
      if (answers[question.id] === undefined) {
        newErrors[question.id] = "この設問は必須です。";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log(answers);
      alert("回答が送信されました！");
    }
  };

  const getQuestions = (): Question[] => {
    switch (version) {
      case "3":
        return questions.slice(0, 3);
      case "9":
        return questions.slice(0, 9);
      default:
        return questions;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">仕事に関する調査 (UWES)</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setVersion("3")}
          className={`px-4 py-2 rounded ${
            version === "3" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          3問版
        </button>
        <button
          onClick={() => setVersion("9")}
          className={`px-4 py-2 rounded ${
            version === "9" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          9問版
        </button>
        <button
          onClick={() => setVersion("17")}
          className={`px-4 py-2 rounded ${
            version === "17" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          17問版
        </button>
      </div>
      <p className="mb-4">
        次の質問文は、仕事に関してどう感じているかを記述したものです。各文をよく読んで、あなたが仕事に関してそのように感じているかどうかを判断してください。
      </p>
      <form onSubmit={handleSubmit}>
        <QuestionSet
          questions={getQuestions()}
          answers={answers}
          setAnswers={setAnswers}
          errors={errors}
        />
        {Object.keys(errors).length > 0 && (
          <p className="text-red-500 mb-4">
            未回答の質問があります。すべての質問にお答えください。
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          回答を送信
        </button>
      </form>
    </div>
  );
};

export default WorkerSurvey;
