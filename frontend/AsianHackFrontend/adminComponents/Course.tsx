import React from 'react'

const Course = () => {
  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-8">
      <h2 className="text-3xl font-bold bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent mb-6">
        Course Management 📚
      </h2>
    
      <p className="text-zinc-600 mb-8">Manage all your learning courses and content here.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((course) => (
          <div key={course} className="bg-white/40 rounded-2xl border border-white/30 p-6 hover:bg-white/60 transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className="w-full h-32 bg-gradient-to-r from-indigo-200 to-violet-200 rounded-xl mb-4 flex items-center justify-center text-4xl">
              🚀
            </div>
            <h3 className="font-semibold text-zinc-800 mb-2">Advanced React Course {course}</h3>
            <p className="text-zinc-600 text-sm mb-4">Master modern React development</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">24 students</span>
              <button className="text-indigo-600 hover:text-indigo-800 transition-colors">Edit →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Course
