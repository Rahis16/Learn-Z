"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, Trophy } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import{Progress} from "@/components/ui/progress"

// Dummy Data
const topStudents = [
  { id: 1, name: "Alice Johnson", score: 98, badge: "Gold" },
  { id: 2, name: "Bob Smith", score: 95, badge: "Silver" },
  { id: 3, name: "Charlie Brown", score: 92, badge: "Bronze" },
];

const topInstructors = [
  { id: 1, name: "Prof. Daniel", courses: 12, students: 1200, earnings: "Rs 50K" },
  { id: 2, name: "Dr. Emily", courses: 8, students: 950, earnings: "Rs 40K" },
  { id: 3, name: "Mr. Frank", courses: 6, students: 700, earnings: "Rs 32K" },
];

const pieData = [
  { name: "Courses Purchased", value: 1200 },
  { name: "Students", value: 5000 },
  { name: "Tutors", value: 320 },
];

const barData = [
  { name: "Q1", purchases: 300 },
  { name: "Q2", purchases: 450 },
  { name: "Q3", purchases: 600 },
  { name: "Q4", purchases: 800 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function AchievementsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🏆 Platform Achievements</h1>

      {/* Key Achievement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Courses Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,200+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5,000+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-500" />
              Total Tutors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">320+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Highest Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">98/100</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📈 Purchases Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="purchases" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🥧 Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      <Card>
        <CardHeader>
          <CardTitle>🏅 Top Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${student.id}`} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-gray-500">Badge: {student.badge}</p>
                  </div>
                </div>
                <p className="font-bold">{student.score}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Instructors */}
      <Card>
        <CardHeader>
          <CardTitle>🎓 Top Instructors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topInstructors.map((inst) => (
              <div
                key={inst.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${inst.id + 5}`} />
                    <AvatarFallback>{inst.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{inst.name}</p>
                    <p className="text-sm text-gray-500">
                      Courses: {inst.courses} | Students: {inst.students}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-green-600">{inst.earnings}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestone Progress */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Platform Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-1">Target 500 Tutors</p>
            <Progress value={(320 / 500) * 100} className="h-2" />
          </div>
          <div>
            <p className="mb-1">Target 10,000 Students</p>
            <Progress value={(5000 / 10000) * 100} className="h-2" />
          </div>
          <div>
            <p className="mb-1">Target 2,000 Courses Purchased</p>
            <Progress value={(1200 / 2000) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}