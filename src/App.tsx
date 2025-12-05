import { useEffect, useState } from "react";
import "./App.css";
import type { SearchResultItem } from "../utils/types.ts";

const apiKey = import.meta.env.VITE_API_KEY;
const cxKey = import.meta.env.VITE_CX_KEY;

function App() {
  const [result, setResult] = useState<SearchResultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startIndex, setStartIndex] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  async function fetchResults(isNewSearch = false, start = startIndex) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cxKey}&q=${encodeURIComponent(
          searchTerm
        )}&start=${start}`
      );

      const data = await response.json();
      const newItems = data.items || [];

      setResult((prev) => (isNewSearch ? newItems : [...prev, ...newItems]));
      setHasMore(!!data.queries?.nextPage);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!searchTerm) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult([]);
      setStartIndex(1);
      return;
    }

    const debounceTimeout = setTimeout(() => {
      setStartIndex(1);
      fetchResults(true, 1);
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  function handleShowMore() {
    setStartIndex((prev) => {
      const next = prev + 10;
      fetchResults(false, next);
      return next;
    });
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto p-4 py-8">
      <section className="flex items-center">
        <input
          placeholder="Search..."
          className="my-4 mx-auto px-2 border-white border-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setSearchTerm("")}>Clear</button>
      </section>

      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-400 ">
          <tr>
            <th className="text-center p-2 border-b  border-r-2">Title</th>
            <th className="text-center p-2 border-b">Link</th>
          </tr>
        </thead>
        <tbody>
          {result.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-2 order-r-2 border-amber-600">{item.title}</td>
              <td className="p-2">
                <a
                  href={item.link}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Open
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasMore && searchTerm.length > 0 && (
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded"
          onClick={handleShowMore}
        >
          Show More
        </button>
      )}

      <div className="mx-auto text-center pt-8">
        {searchTerm.length === 0 && <h1>Nothing to show</h1>}
      </div>
    </div>
  );
}

export default App;
