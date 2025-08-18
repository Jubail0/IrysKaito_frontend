import { useState, useEffect } from "react";
import { FaSpinner, FaBook } from "react-icons/fa";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Attach token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("userJWT");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [unlockTime, setUnlockTime] = useState(null);
  const [countdown, setCountdown] = useState("");

  // --- Fetch quiz & lock state ---
  const fetchQuiz = async () => {
    try {
      setLoading(true);

      const res = await API.get("/quiz/questions");

      if (res.data.locked) {
        setLocked(true);
        setQuestions([]);
        if (res.data.nextBatchAvailable || res.data.nextQuizAvailable) {
          setUnlockTime(
            new Date(res.data.nextBatchAvailable || res.data.nextQuizAvailable)
          );
        }
      } else {
        setLocked(false);
        setQuestions(res.data.questions || []);
        setUnlockTime(
          res.data.nextBatchAvailable
            ? new Date(res.data.nextBatchAvailable)
            : null
        );
      }

      // don’t auto-set submitted
      setSubmitted(false);
      setScore(0);
      setAnswers({});
    } catch (err) {
      console.error("Error fetching quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  // --- Countdown ---
  useEffect(() => {
    if (!unlockTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = unlockTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        fetchQuiz(); // reload when unlocked
      } else {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockTime]);

  // --- Submit answers ---
  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(
        ([qId, selectedOption]) => ({
          questionId: qId,
          selectedOption,
        })
      );

      const res = await API.post("/quiz/submit", { answers: formattedAnswers });

      if (res.data.locked) {
        setLocked(true);
        if (res.data.nextQuizAvailable) {
          setUnlockTime(new Date(res.data.nextQuizAvailable));
        }
      }

      setScore(res.data.score || 0);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  // --- UI ---
  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <FaSpinner className="animate-spin text-3xl text-[#51FFD6]" />
      </div>
    );

  // If locked (before answering)
  if (locked && !submitted)
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-white">Quiz Locked ⏳</h2>
        {countdown && (
          <p className="text-gray-400 mt-2">
            You can attempt the quiz again in: {countdown}
          </p>
        )}
      </div>
    );

  // If submitted (after answering)
  if (submitted)
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4 text-[#51FFD6]">
          Your Score: {score}
        </h2>
        {score >= 30 ? (
          <p className="text-green-400">🎉 Congrats! You are an IRYS Believer!</p>
        ) : (
          <p className="text-red-400">
            Keep studying IRYS and try again tomorrow!
          </p>
        )}
        {countdown && (
          <p className="text-gray-400 mt-4">
            Next quiz available in: {countdown}
          </p>
        )}
      </div>
    );

  // Quiz Questions
  return (
    <div className="max-w-xl mx-auto bg-[#18191A] p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-[#51FFD6] mb-3 text-center">
        Daily IRYS Quiz
      </h2>
      <p className="mb-8 text-center text-base text-gray-300 flex items-center justify-center gap-1"><FaBook/>Study Irys: <a target="_blank" className="underline italic" href="https://docs.irys.xyz/learn/what/what-a-datachain-is">docs.irys.xyz</a></p>
      {questions.map((q, i) => (
        <div key={q._id} className="mb-6">
          <p className="mb-3 font-semibold text-white">
            {i + 1}. {q.question}
          </p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, idx) => {
              const selected = answers[q._id] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => setAnswers({ ...answers, [q._id]: opt })}
                  className={`text-white px-4 py-2 rounded-xl border transition-colors duration-200 text-left
                    ${
                      selected
                        ? "bg-[#51FFD6] text-black border-[#51FFD6]"
                        : "bg-[#242526] border-gray-700 hover:bg-gray-700"
                    }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={(Object.keys(answers).length !== questions.length) || questions.length === 0}
        className="w-full bg-[#51FFD6] text-black font-semibold py-2 rounded-lg mt-4 hover:bg-[#3cd9b4] transition disabled:opacity-50"
      >
        Submit Quiz
      </button>

      {/* Show countdown under quiz if unlocked */}
      {countdown && !locked && (
        <p className="text-gray-400 text-center mt-4">
          ⏳ Next batch available in: {countdown}
        </p>
      )}
    </div>
  );
}
