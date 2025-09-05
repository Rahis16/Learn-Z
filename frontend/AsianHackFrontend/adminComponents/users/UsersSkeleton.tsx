import React from 'react'

const UsersSkeleton = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
        {/* Refresh Button Skeleton */}
        <div className="flex items-center mb-3 justify-right">
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-200 rounded-lg animate-pulse w-10 h-10" />
            <div>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-24 bg-white border border-gray-200 rounded-xl p-4 animate-pulse"></div>
          ))}
        </div>

        {/* Search and other bars  */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-pulse h-20"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-pulse h-20">
          <div className="h-8 w-80 bg-gray-100 shadow-sm rounded-lg animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default UsersSkeleton
