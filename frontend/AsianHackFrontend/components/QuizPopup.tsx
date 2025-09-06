import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Trophy, Target } from 'lucide-react';

type QuizQuestion = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

type Quiz = {
  quiz: QuizQuestion[];
};

interface EnhancedQuizModalProps {
  quiz: Quiz | null; // `Quiz` type from your types
  handleClose: () => void;
}

const EnhancedQuizModal = ({ quiz, handleClose }: EnhancedQuizModalProps) => { 
  // Sample quiz data based on your structure
  //   const sampleQuiz: Quiz = {
  //     quiz: [
  //       {
  //         question: "Which of the following is NOT mentioned as a key component of HTML structure?",
  //         options: ['<!DOCTYPE html>', '<html>', '<head>', '<style>'],
  //         correct_answer: "<style>",
  //         explanation: "The video mentions <!DOCTYPE html>, <html>, <head>, and <body> as key HTML components, but not <style>."
  //       },
  //       {
  //         question: "What is the purpose of the tutorial?",
  //         options: ['To teach advanced web development', 'To guide beginners through building their first HTML website', 'To explain the server-side programming', 'To demonstrate advanced CSS techniques'],
  //         correct_answer: "To guide beginners through building their first HTML website",
  //         explanation: "The video states it's for absolute beginners learning to build their first HTML website."
  //       },
  //       {
  //         question: "What is VS Code?",
  //         options: ['A web server', 'A programming language', 'A code editor', 'A version control system'],
  //         correct_answer: "A code editor",
  //         explanation: "VS Code is mentioned as an installation for setting up the development environment, and it is a code editor."
  //       },
  //       {
  //         question: "What is the client-server model compared to in the video?",
  //         options: ['A car', 'An iPhone', 'A computer', 'A book'],
  //         correct_answer: "An iPhone",
  //         explanation: "The client-server model is explained through relatable analogies like using an iPhone."
  //       },
  //       {
  //         question: "Which of the following is NOT a topic covered in the tutorial?",
  //         options: ['HTML basics', 'CSS styling', 'Advanced JavaScript frameworks', 'Web development setup'],
  //         correct_answer: "Advanced JavaScript frameworks",
  //         explanation: "The tutorial focuses on beginner topics and does not cover advanced frameworks."
  //       }
  //     ]
  //   };

  // Quiz states
  //   const [quiz] = useState<Quiz>(sampleQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuizModal, setShowQuizModal] = useState(true);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [timerEnabled, setTimerEnabled] = useState(true);

  // Timer effect
  useEffect(() => {
    if (!timerEnabled || quizFinished || showExplanation) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-skip when time runs out
      handleAnswer('');
    }
  }, [timeLeft, timerEnabled, quizFinished, showExplanation]);

  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestionIndex]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setUserAnswers(prev => [...prev, answer]);
    setShowExplanation(true);

    // Calculate score
    if (answer === quiz.quiz[currentQuestionIndex].correct_answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < quiz.quiz.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const getScoreColor = () => {
    const percentage = (score / quiz.quiz.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / quiz.quiz.length) * 100;
    if (percentage >= 80) return 'Excellent! 🎉';
    if (percentage >= 60) return 'Good job! 👍';
    return 'Keep practicing! 💪';
  };

  if (!showQuizModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!quizFinished ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quiz Time!</h2>
                {timerEnabled && (
                  <div className="flex text-black items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold text-lg">{timeLeft}s</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-2">
                  <span>Question {currentQuestionIndex + 1} of {quiz.quiz.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / quiz.quiz.length) * 100)}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / quiz.quiz.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {quiz.quiz.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index < currentQuestionIndex
                        ? 'bg-green-400'
                        : index === currentQuestionIndex
                          ? 'bg-white'
                          : 'bg-white bg-opacity-30'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                  {quiz.quiz[currentQuestionIndex].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {quiz.quiz[currentQuestionIndex].options.map((option, idx) => {
                  let buttonClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ";

                  if (showExplanation) {
                    if (option === quiz.quiz[currentQuestionIndex].correct_answer) {
                      buttonClass += "bg-green-50 border-green-500 text-green-800";
                    } else if (option === selectedAnswer && option !== quiz.quiz[currentQuestionIndex].correct_answer) {
                      buttonClass += "bg-red-50 border-red-500 text-red-800";
                    } else {
                      buttonClass += "bg-gray-50 border-gray-300 text-gray-600";
                    }
                  } else {
                    buttonClass += "border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700";
                  }

                  return (
                    <button
                      key={idx}
                      className={buttonClass}
                      onClick={() => !showExplanation && handleAnswer(option)}
                      disabled={showExplanation}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex-shrink-0 w-6 border-[1px] h-6 rounded-full bg-black/5 flex items-center justify-center text-sm font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showExplanation && option === quiz.quiz[currentQuestionIndex].correct_answer && (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        {showExplanation && option === selectedAnswer && option !== quiz.quiz[currentQuestionIndex].correct_answer && (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      !
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Explanation</h4>
                      <p className="text-blue-700">{quiz.quiz[currentQuestionIndex].explanation}</p>
                    </div>
                  </div>
                </div>
              )}


              <div className='flex items-center justify-between'>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl cursor-pointer"
                >
                Close
                </button>

                {/* Next Button */}
                {showExplanation && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {currentQuestionIndex + 1 === quiz.quiz.length ? 'Finish Quiz' : 'Next Question'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Results Screen */
          <div className="p-8 text-center">
            <div className="mb-6">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600">Great job on finishing the quiz!</p>
            </div>

            {/* Score Display */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Target className="w-8 h-8 text-blue-600" />
                <div>
                  <div className={`text-4xl font-bold ${getScoreColor()}`}>
                    {score}/{quiz.quiz.length}
                  </div>
                  <div className="text-gray-600">
                    {Math.round((score / quiz.quiz.length) * 100)}% Score
                  </div>
                </div>
              </div>
              <div className={`text-xl font-semibold ${getScoreColor()}`}>
                {getScoreMessage()}
              </div>
            </div>

            {/* Question Review */}
            <div className="max-h-60 overflow-y-auto mb-6 text-left">
              <h3 className="text-lg font-semibold mb-4 text-center">Review Your Answers</h3>
              {quiz.quiz.map((q, i) => (
                <div key={i} className="mb-4 p-4 border rounded-lg">
                  <div className="font-medium text-gray-800 mb-2">
                    Q{i + 1}: {q.question}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className={`${userAnswers[i] === q.correct_answer ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {userAnswers[i] || 'No answer'}
                      {userAnswers[i] === q.correct_answer ? ' ✓' : ' ✗'}
                    </div>
                    {userAnswers[i] !== q.correct_answer && (
                      <div className="text-green-600">
                        Correct answer: {q.correct_answer}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Close Quiz
              </button>
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setUserAnswers([]);
                  setQuizFinished(false);
                  setScore(0);
                  setSelectedAnswer('');
                  setShowExplanation(false);
                  setTimeLeft(30);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Retake Quiz
              </button>
            </div>

            {/* Timer Toggle */}
            <div className="mt-6 flex justify-center items-center space-x-3">
              <label className="text-sm text-gray-600">Timer enabled:</label>
              <button
                onClick={() => setTimerEnabled(!timerEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${timerEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  } relative`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${timerEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedQuizModal;