// src/components/skeletons/ThemeSkeleton.jsx
export const ThemeSkeleton = () => {
    return (
      <div className="animate-pulse max-w-2xl mx-auto mt-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        
        {/* Logo Card Skeleton */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-[200px] bg-gray-200 rounded-lg w-full"></div>
        </div>
        
        {/* Colors Card Skeleton */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 gap-x-12">
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-28 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-28 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };