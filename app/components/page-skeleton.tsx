export default function PageSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>
      <div className="h-4 bg-gray-200 rounded-md w-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-md w-4/6 mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
