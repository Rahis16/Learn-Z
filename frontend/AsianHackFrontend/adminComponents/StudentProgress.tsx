import React from 'react'

const StudentProgress = () => {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent mb-6">
        Student Management 🎓
      </h2>
      <p className="text-zinc-600 mb-8">Monitor student progress and engagement.</p>
      
      <div className="space-y-4">
        {[
          { name: "Alex Johnson", course: "React Mastery", progress: 85 },
          { name: "Sarah Chen", course: "JavaScript Basics", progress: 92 },
          { name: "Mike Wilson", course: "Python Fundamentals", progress: 67 },
          { name: "Emma Davis", course: "Web Design", progress: 78 },
        ].map((student, index) => (
          <div key={index} className="bg-white/40 rounded-2xl border border-white/30 p-6 hover:bg-white/60 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-zinc-800">{student.name}</h3>
                <p className="text-zinc-600 text-sm">{student.course}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-indigo-600">{student.progress}%</div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentProgress
