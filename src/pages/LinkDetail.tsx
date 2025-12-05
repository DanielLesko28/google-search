import { useLocation } from "react-router-dom";

const LinkDetail = () => {
  const location = useLocation();
  const item = location.state?.item;

  if (!item) return <div>Item not found</div>;

  console.log("detail item", item);

  return (
    <div className="p-4">
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
