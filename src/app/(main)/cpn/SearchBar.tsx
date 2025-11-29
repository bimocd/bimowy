import { SearchIcon } from "lucide-react";
import type { Dispatch } from "react";

export default function SearchBar({
  query,
  setQuery,
}: {
  query: string | null;
  setQuery: Dispatch<string | null>;
}) {
  return (
    <div className="w-full flex justify-center">
      <div
        className={`p-2 px-3 bg-card ring-2 ring-accent rounded-md flex gap-3
          group/searchbar focus-within:ring-white/80 duration-100
          w-1/2`}
      >
        <SearchIcon
          className={`opacity-50 h-lh group-focus-within/searchbar:opacity-100 
        group-focus-within/searchbar:stroke-3 duration-100`}
        />
        <input
          className={`w-full focus:outline-none`}
          onChange={(ev) => setQuery(ev.target.value || null)}
          value={query || ""}
        />
      </div>
    </div>
  );
}
