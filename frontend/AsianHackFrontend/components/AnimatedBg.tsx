import React from 'react'

const AnimatedBg = () => {
  return (
    <>
     {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50" />

        {/* Animated Orbs */}
        <div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-200/30 to-sky-300/30 rounded-full blur-3xl animate-pulse"
          style={{
            animation:
              "float1 8s ease-in-out infinite, pulse 3s ease-in-out infinite",
          }}
        />

        <div
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-violet-200/40 to-fuchsia-300/40 rounded-full blur-3xl"
          style={{
            animation:
              "float2 10s ease-in-out infinite, pulse 4s ease-in-out infinite",
          }}
        />

        <div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-sky-200/35 to-indigo-300/35 rounded-full blur-3xl"
          style={{
            animation:
              "rotate 12s linear infinite, pulse 5s ease-in-out infinite",
          }}
        />

        <div
          className="absolute top-60 right-1/3 w-64 h-64 bg-gradient-to-r from-fuchsia-200/30 to-violet-300/30 rounded-full blur-2xl"
          style={{
            animation:
              "float1 6s ease-in-out infinite reverse, pulse 3.5s ease-in-out infinite",
          }}
        />
      </div>
    </>
  )
}

export default AnimatedBg
