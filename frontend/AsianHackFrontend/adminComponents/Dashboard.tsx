import React from 'react'
import { GraduationCap, BookOpen, Trophy, Brain, Stars } from 'lucide-react';

const Dashboard = () => {
    const stats = [
    { label: "Total Students", value: "2,847", change: "+12%", icon: <GraduationCap size={24} />, color: "from-indigo-500 to-violet-500" },
    { label: "Active Courses", value: "156", change: "+8%", icon: <BookOpen size={24} />, color: "from-sky-500 to-indigo-500" },
    { label: "Completed Lessons", value: "18,392", change: "+23%", icon: <Trophy size={24} />, color: "from-violet-500 to-fuchsia-500" },
    { label: "Learning Hours", value: "45,280", change: "+15%", icon: <Brain size={24} />, color: "from-fuchsia-500 to-sky-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl flex items-center gap-2 font-bold bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent mb-2">
            Welcome back, Admin! <Brain size={35} className="text-indigo-600" />
          </h1>
          <p className="text-zinc-600 text-lg">Here's what's happening with Learn-z today</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative animate-fadeInUp hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 rounded-3xl blur transition-all duration-300`} />
            
            <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 p-6 group-hover:bg-white/80 transition-all duration-300 shadow-lg group-hover:shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.2) 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-800 mb-1">{stat.value}</h3>
                <p className="text-zinc-600 text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-zinc-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Create New Course", desc: "Add a new learning path", color: "from-indigo-500 to-violet-500" },
              { title: "Review Assignments", desc: "Check student submissions", color: "from-sky-500 to-indigo-500" },
              { title: "Send Announcement", desc: "Broadcast to all students", color: "from-violet-500 to-fuchsia-500" },
            ].map((action, index) => (
              <button
                key={index}
                className="group p-6 bg-white/40 rounded-2xl border border-white/30 hover:bg-white/60 transition-all duration-300 text-left hover:shadow-lg hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Stars size={20} />
                </div>
                <h3 className="font-semibold text-zinc-800 mb-2">{action.title}</h3>
                <p className="text-zinc-600 text-sm">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard
