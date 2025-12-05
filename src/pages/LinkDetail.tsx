import { useLocation, useNavigate } from "react-router-dom";

const LinkDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) return <div>Item not found</div>;

  console.log("detail item", item);

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
      >
        ← Back
      </button>
      <h1 className="text-xl font-bold">{item.title}</h1>
      <p>
        <a href={item.link} target="_blank" className="text-blue-600 underline">
          Visit Link
        </a>
      </p>
      <p className="mt-4">{item.snippet}</p>
    </div>
  );
};

export default LinkDetail;
