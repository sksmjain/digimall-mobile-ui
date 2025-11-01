import { Search } from "lucide-react";

export default function SearchUI({ placeholder = "Search..." }: { placeholder?: string }) {
  return (
    <div className="p-4 relative">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
              type="text"
              placeholder={placeholder}
              className="input pl-8"
            />
    </div>
  )
}