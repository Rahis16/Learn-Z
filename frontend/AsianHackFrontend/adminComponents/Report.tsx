"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Dummy Data
const studentReports = [
  {
    id: 1,
    reporter: "Sita Sharma",
    reporterImg: "https://i.pravatar.cc/50?img=12",
    reported: "Ram Koirala",
    reportedImg: "https://i.pravatar.cc/50?img=20",
    reason: "Instructor was not helpful during Q&A",
    status: "Pending",
    date: "2025-09-01",
  },
  {
    id: 2,
    reporter: "Laxmi Shrestha",
    reporterImg: "https://i.pravatar.cc/50?img=30",
    reported: "Bikash Adhikari",
    reportedImg: "https://i.pravatar.cc/50?img=40",
    reason: "Content not clear",
    status: "Resolved",
    date: "2025-08-28",
  },
];

const instructorReports = [
  {
    id: 1,
    reporter: "Ram Koirala",
    reporterImg: "https://i.pravatar.cc/50?img=22",
    reported: "Sita Sharma",
    reportedImg: "https://i.pravatar.cc/50?img=18",
    reason: "Student misbehaved in live session",
    status: "Pending",
    date: "2025-09-02",
  },
  {
    id: 2,
    reporter: "Bikash Adhikari",
    reporterImg: "https://i.pravatar.cc/50?img=42",
    reported: "Laxmi Shrestha",
    reportedImg: "https://i.pravatar.cc/50?img=32",
    reason: "Student posted irrelevant content",
    status: "Resolved",
    date: "2025-08-27",
  },
];

// Pie Chart Data
const pieData = [
  { name: "Student Reports", value: studentReports.length },
  { name: "Instructor Reports", value: instructorReports.length },
];
const COLORS = ["#6366f1", "#f97316"];

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📝 Platform Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="text-center">
            <p className="text-lg font-medium">Total Reports</p>
            <p className="text-2xl">{studentReports.length + instructorReports.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-lg font-medium">Pending</p>
            <p className="text-2xl">
              {studentReports.filter(r => r.status === "Pending").length +
                instructorReports.filter(r => r.status === "Pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-lg font-medium">Resolved</p>
            <p className="text-2xl">
              {studentReports.filter(r => r.status === "Resolved").length +
                instructorReports.filter(r => r.status === "Resolved").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Reports Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs for Student / Instructor Reports */}
      <Tabs defaultValue="studentReports">
        <TabsList>
          <TabsTrigger value="studentReports">Student Reports</TabsTrigger>
          <TabsTrigger value="instructorReports">Instructor Reports</TabsTrigger>
        </TabsList>

        {/* Student Reports */}
        <TabsContent value="studentReports">
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Reporter</th>
                  <th className="px-4 py-2">Reported</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentReports.map((report) => (
                  <tr key={report.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={report.reporterImg} />
                        <AvatarFallback>{report.reporter[0]}</AvatarFallback>
                      </Avatar>
                      {report.reporter}
                    </td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={report.reportedImg} />
                        <AvatarFallback>{report.reported[0]}</AvatarFallback>
                      </Avatar>
                      {report.reported}
                    </td>
                    <td className="px-4 py-2">{report.reason}</td>
                    <td className="px-4 py-2">
                      {report.status === "Pending" ? (
                        <span className="text-orange-500 font-medium">{report.status}</span>
                      ) : (
                        <span className="text-green-600 font-medium">{report.status}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{report.date}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> View
                      </Button>
                      {report.status === "Pending" && (
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" /> Resolve
                        </Button>
                      )}
                      <Button size="sm" className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Restrict
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Instructor Reports */}
        <TabsContent value="instructorReports">
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Reporter</th>
                  <th className="px-4 py-2">Reported</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructorReports.map((report) => (
                  <tr key={report.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={report.reporterImg} />
                        <AvatarFallback>{report.reporter[0]}</AvatarFallback>
                      </Avatar>
                      {report.reporter}
                    </td>
                    <td className="px-4 py-2 flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={report.reportedImg} />
                        <AvatarFallback>{report.reported[0]}</AvatarFallback>
                      </Avatar>
                      {report.reported}
                    </td>
                    <td className="px-4 py-2">{report.reason}</td>
                    <td className="px-4 py-2">
                      {report.status === "Pending" ? (
                        <span className="text-orange-500 font-medium">{report.status}</span>
                      ) : (
                        <span className="text-green-600 font-medium">{report.status}</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{report.date}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="w-4 h-4" /> View
                      </Button>
                      {report.status === "Pending" && (
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" /> Resolve
                        </Button>
                      )}
                      <Button size="sm" className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Restrict
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}