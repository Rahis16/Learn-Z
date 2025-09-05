"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

// Dummy data
const feedbackStats = {
  total: 120,
  good: 90,
  bad: 30,
};

const feedbackSummary = `
LearnZ AI has analyzed the recent feedback. 
Overall, most students are satisfied with the platform’s course quality and instructor support. 
The majority of feedback highlights smooth learning experience and engaging quizzes. 
However, students suggested improvements in course variety, mobile responsiveness, 
and adding more advanced premium content. 
`;

const feedbackDistribution = [
  { name: "Good Feedback", value: feedbackStats.good },
  { name: "Bad Feedback", value: feedbackStats.bad },
];

const COLORS = ["#4ade80", "#f87171"];

const topSuggestions = [
  { name: "More Premium Courses", value: 65 },
  { name: "Mobile App Improvements", value: 50 },
  { name: "Faster Support", value: 30 },
  { name: "Advanced Quizzes", value: 40 },
  { name: "Community Features", value: 25 },
];

const recentFeedback = [
  {
    id: 1,
    student: "Sita Sharma",
    feedback: "Loved the quizzes and AI support, very smooth experience.",
    sentiment: "Good",
    date: "2025-09-01",
  },
  {
    id: 2,
    student: "Ram Koirala",
    feedback: "Needs more premium courses, but overall good.",
    sentiment: "Good",
    date: "2025-08-29",
  },
  {
    id: 3,
    student: "Laxmi Shrestha",
    feedback: "Mobile UI is laggy sometimes.",
    sentiment: "Bad",
    date: "2025-08-25",
  },
  {
    id: 4,
    student: "Bikash Adhikari",
    feedback: "Very helpful instructors and content.",
    sentiment: "Good",
    date: "2025-08-20",
  },
];

export default function FeedbackPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">📊 Platform Feedback Overview</h1>

      {/* Summary by AI */}
      <Card>
        <CardHeader>
          <CardTitle>LearnZ AI Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {feedbackSummary}
          </p>
        </CardContent>
      </Card>

      {/* Stats + Pie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <MessageSquare className="w-6 h-6 text-indigo-500" />
            <p className="text-lg font-semibold mt-2">Total Feedback</p>
            <p className="text-2xl">{feedbackStats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ThumbsUp className="w-6 h-6 text-green-500" />
            <p className="text-lg font-semibold mt-2">Good Feedback</p>
            <p className="text-2xl">{feedbackStats.good}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ThumbsDown className="w-6 h-6 text-red-500" />
            <p className="text-lg font-semibold mt-2">Bad Feedback</p>
            <p className="text-2xl">{feedbackStats.bad}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Feedback Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={feedbackDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {feedbackDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topSuggestions}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2">Student</th>
                <th className="px-4 py-2">Feedback</th>
                <th className="px-4 py-2">Sentiment</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentFeedback.map((fb) => (
                <tr key={fb.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2">{fb.student}</td>
                  <td className="px-4 py-2">{fb.feedback}</td>
                  <td className="px-4 py-2">
                    {fb.sentiment === "Good" ? (
                      <span className="text-green-600 font-medium">👍 Good</span>
                    ) : (
                      <span className="text-red-600 font-medium">👎 Bad</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{fb.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}