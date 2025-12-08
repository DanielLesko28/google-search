import { useEffect, useState } from "react";
import type { SearchResultItem } from "../utils/types.ts";
import { downloadCSV, downloadXLSX } from "../utils/actions.ts";
import { Button, SimpleButton } from "../components/Button.tsx";
import ArticlesTable from "../components/ArticlesTable.tsx";
import MainHeading from "../components/MainHeading.tsx";
import SearchInput from "../components/SearchInput.tsx";

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
    }, 800);

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
      <MainHeading />

      <section className="flex items-center">
        <SearchInput
          searchTerm={searchTerm}
          changeFunction={(e) => setSearchTerm(e.target.value)}
        />
        {result.length > 0 && (
          <SimpleButton
            title="Clear"
            className="border-amber-500 border-2 ml-2 px-2"
            onClickFunction={() => setSearchTerm("")}
          />
        )}
      </section>

      {/* Export buttons */}
      {result.length > 0 && (
        <div className="flex gap-3 my-4">
          <Button
            data={result}
            onClickFunction={downloadCSV}
            className="p-2 bg-green-600 text-white rounded"
            title="Download CSV"
          />

          <Button
            data={result}
            onClickFunction={downloadXLSX}
            className="p-2 bg-yellow-500 text-black rounded"
            title="Download Excel"
          />
        </div>
      )}

      {/* TABLE */}
      {searchTerm.length > 0 && result.length > 0 && (
        <ArticlesTable data={result} />
      )}

      {/* Show More */}
      {hasMore && searchTerm.length > 0 && result.length > 0 && (
        <div className="flex justify-center">
          <SimpleButton
            title="Show More"
            className="mt-4 p-2 bg-white text-black rounded"
            onClickFunction={handleShowMore}
          />
        </div>
      )}

      <div className="mx-auto text-center text-xl lg:text-4xl pt-[200px]">
        {searchTerm.length === 0 && <h1>Nothing to show</h1>}
      </div>
    </div>
  );
}

export default Home;
