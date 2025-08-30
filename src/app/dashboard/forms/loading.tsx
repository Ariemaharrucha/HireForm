export default function Loading() {
    return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-white p-4 border border-gray-300 rounded-2xl">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border shadow-sm bg-white p-4 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="h-32 w-full bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
  }
  