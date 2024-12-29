// src/components/skeletons/NotesSkeleton.jsx
export default function NotesSkeleton() {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        {[1,2,3].map(i => (
          <div key={i} className="p-4 border rounded-lg space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }