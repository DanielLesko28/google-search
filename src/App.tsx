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

  useEffect(() => {
    if (!searchTerm) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult([]);
      return;
    }

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

  console.log("result", result);

  return (
    <div className="w-full max-w-[1000px] mx-auto p-4 py-8">
      <h1>Hello Daniel</h1>
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
    </div>
  );
}

export default App;
