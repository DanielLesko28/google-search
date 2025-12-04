import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/customsearch/v1?key=AIzaSyCNNgFq67GsLtCH18fHPHbsyDWXER1zcG0&cx=b3afb02f3f21a4152&q=Slafkovsky"
        );
        const data = await response.json();
        console.log("data in fetch", data);

        if (data.items) {
          setResult(data.items);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Hello Daniel</h1>
      <input placeholder="Search..." />

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
    </>
  );
}

export default App;
