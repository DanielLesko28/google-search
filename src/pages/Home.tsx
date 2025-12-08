import { useEffect, useState } from "react";
import type { SearchResultItem } from "../utils/types.ts";
import { Link } from "react-router-dom";
import { downloadCSV, downloadXLSX } from "../utils/actions.ts";

const apiKey = import.meta.env.VITE_API_KEY;
const cxKey = import.meta.env.VITE_CX_KEY;

function Home() {
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
      console.log("data from fetching", {
        data,
        newItems,
      });

      setResult((prev) => (isNewSearch ? newItems : [...prev, ...newItems]));
      setHasMore(!!data.queries?.nextPage);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!searchTerm) {
      setResult([]);
      setStartIndex(1);
      return;
    }

    const debounceTimeout = setTimeout(() => {
      setStartIndex(1);
      fetchResults(true, 1);
    }, 500);

    return () => clearTimeout(debounceTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <h1 className="text-2xl lg:text-4xl text-center py-6 text-amber-300">
        Simple search
      </h1>

      <section className="flex items-center">
        <input
          placeholder="Search..."
          className="my-4 mx-auto px-2 border-white border-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {result.length > 0 && (
          <button
            onClick={() => setSearchTerm("")}
            className="border-amber-500 border-2 ml-2 px-2"
          >
            Clear
          </button>
        )}
      </section>

      {/* Export buttons */}
      {result.length > 0 && (
        <div className="flex gap-3 my-4">
          <button
            onClick={() => downloadCSV(result)}
            className="p-2 bg-green-600 text-white rounded"
          >
            Download CSV
          </button>

          <button
            onClick={() => downloadXLSX(result)}
            className="p-2 bg-yellow-500 text-black rounded"
          >
            Download Excel
          </button>
        </div>
      )}

      {/* TABLE */}
      {searchTerm.length > 0 && result.length > 0 && (
        <table className="w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-400">
            <tr>
              <th className="text-center p-2 border-b border-r-2">Title</th>
              <th className="text-center p-2 border-b">Link</th>
            </tr>
          </thead>

          <tbody>
            {result.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-600 text-white">
                <td className="p-2 pl-4 border-r-2">
                  <Link
                    to={`/link/${index}`}
                    state={{ item }}
                    className="text-white underline"
                  >
                    {item.title}
                  </Link>
                </td>

                <td className="p-2">
                  <a
                    href={item.link}
                    target="_blank"
                    className="text-blue-400 underline"
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Show More */}
      {hasMore && searchTerm.length > 0 && result.length > 0 && (
        <div className="flex justify-center">
          <button
            className="mt-4 p-2 bg-white text-black rounded"
            onClick={handleShowMore}
          >
            Show More
          </button>
        </div>
      )}

      <div className="mx-auto text-center text-xl lg:text-4xl pt-[200px]">
        {searchTerm.length === 0 && <h1>Nothing to show</h1>}
      </div>
    </div>
  );
}

export default Home;
