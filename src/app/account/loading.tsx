import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">
        Loading...
      </p>
    </div>
  );
}