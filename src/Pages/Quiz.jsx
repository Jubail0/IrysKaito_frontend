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
        fetchQuiz();
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

  // --- Share on X ---
// Share function inside your Quiz component
const handleShare = () => {
  const text = encodeURIComponent(
    `I just scored ${score}/50 in the Daily @irys_xyz Quiz 🎯\n\nTop 10 participants win a share of 2 IRYS Test Tokens weekly. Study @irys_xyz and submit your answers today!\n\nHosted by @JubailMallick\nirys-amplifiers.onrender.com`
  );

  const shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(shareUrl, "_blank");
};



  // --- UI ---
  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <FaSpinner className="animate-spin text-4xl text-[#51FFD6]" />
      </div>
    );

  if (locked && !submitted)
    return (
      <div className="text-center py-12 bg-[#18191A] rounded-2xl shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white">🚫 Quiz Locked</h2>
        {countdown && (
          <p className="text-gray-400 mt-3">
            You can attempt again in:{" "}
            <span className="font-mono text-[#51FFD6]">{countdown}</span>
          </p>
        )}
      </div>
    );

  if (submitted)
    return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-[#18191A] rounded-2xl shadow-xl p-8 border border-gray-800 text-center">
        <h2 className="text-3xl font-extrabold text-[#51FFD6] mb-3">
          Your Score: {score}/50
        </h2>

        {score >= 30 ? (
          <p className="text-green-400 text-lg font-medium mb-4">
            🎉 Awesome! You’re an IRYS Believer!
          </p>
        ) : (
          <p className="text-red-400 text-lg font-medium mb-4">
            📘 Keep learning IRYS & try again tomorrow!
          </p>
        )}

        {/* Share on X if score >= 50 */}
        {score >= 50 && (
          <button
            onClick={handleShare}
            className="mt-4 px-6 py-3 rounded-xl bg-[#1DA1F2] text-white font-semibold hover:bg-[#0d8ddb] transition w-full"
          >
            🔗 Share on X
          </button>
        )}

        {countdown && (
          <div className="mt-6 bg-[#242526] p-4 rounded-xl">
            <p className="text-gray-400 text-sm">
              ⏳ Next quiz unlocks in:
            </p>
            <p className="font-mono text-[#51FFD6] text-lg">{countdown}</p>
          </div>
        )}
      </div>
    </div>

    );

  return (
    <div className="max-w-2xl mx-auto bg-[#18191A] p-8 rounded-2xl my-10 shadow-lg border border-gray-800">
      <h2 className="text-2xl font-extrabold text-[#51FFD6] mb-4 text-center">
         Daily IRYS Quiz
      </h2>
      <p className="mb-8 text-center text-sm text-gray-400 flex items-center justify-center gap-2">
        <FaBook className="text-[#51FFD6]" />
        Study Irys:{" "}
        <a
          target="_blank"
          rel="noreferrer"
          className="underline italic hover:text-[#51FFD6] transition"
          href="https://docs.irys.xyz/learn/what/what-a-datachain-is"
        >
          docs.irys.xyz
        </a>
      </p>

      {questions.map((q, i) => (
        <div key={q._id} className="mb-6">
          <p className="mb-3 font-semibold text-white">
            {i + 1}. {q.question}
          </p>
          <div className="grid gap-2">
            {q.options.map((opt, idx) => {
              const selected = answers[q._id] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => setAnswers({ ...answers, [q._id]: opt })}
                  className={`px-4 py-3 rounded-xl border transition-all duration-200 text-left
                    ${
                      selected
                        ? "bg-[#51FFD6] text-black border-[#51FFD6] shadow-md scale-[1.02]"
                        : "bg-[#242526] text-white border-gray-700 hover:bg-gray-700 hover:scale-[1.01]"
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
        disabled={
          Object.keys(answers).length !== questions.length || questions.length === 0
        }
        className="w-full bg-[#51FFD6] text-black font-bold py-3 rounded-lg mt-6 hover:bg-[#3cd9b4] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        🚀 Submit Quiz
      </button>

      {countdown && !locked && (
        <p className="text-gray-400 text-center mt-6 text-sm">
          ⏳ Next batch available in:{" "}
          <span className="font-mono text-[#51FFD6]">{countdown}</span>
        </p>
      )}
    </div>
  );
}
