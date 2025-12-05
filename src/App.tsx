import { useEffect, useState } from "react";
import "./App.css";

interface SearchResultItem {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap?: {
    metatags?: Array<Record<string, string>>;
    cse_image?: Array<{ src: string }>;
  };
}

const apiKey = import.meta.env.VITE_API_KEY;
const cxKey = import.meta.env.VITE_CX_KEY;

function App() {
  const [result, setResult] = useState<SearchResultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startIndex, setStartIndex] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  async function fetchResults(isNewSearch = false) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cxKey}&q=${encodeURIComponent(
          searchTerm
        )}&start=${startIndex}`
      );
      const data = await response.json();

      const newItems = data.items || [];

      // If it's a new search → replace
      // If it's show more → append
      setResult((prev) => (isNewSearch ? newItems : [...prev, ...newItems]));

      // Check if more pages exist
      setHasMore(!!data.queries?.nextPage);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!searchTerm) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult([]);
      return;
    }

    // const timeout = setTimeout(() => {
    //   fetchResults(true);
    // }, 500);

    const debounceTimeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cxKey}&q=${encodeURIComponent(
            searchTerm
          )}`
        );
        const data = await response.json();

        if (data.items) {
          setResult(data.items);
        } else {
          setResult([]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setResult([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  function handleShowMore() {
    setStartIndex((prev) => prev + 10);
    fetchResults(false);
  }

  console.log("result", result);

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

      <div>
        {result.map((item, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <h3>{item.title}</h3>
            <p>{item.snippet}</p>
            <a href={item.link} target="_blank">
              Open
            </a>
          </div>
        ))}
      </div>
      {hasMore && (
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
