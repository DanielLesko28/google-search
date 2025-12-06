import { useLocation, useNavigate } from "react-router-dom";

const LinkDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) return <div>Item not found</div>;

  console.log("detail item", item);

  return (
    <section className="w-full flex justify-center">
      <div className="p-4 w-full max-w-[800px]">
        <button
          onClick={() => navigate(-1)}
          className="my-8 mb-12 px-4 py-2 text-md bg-amber-500 rounded hover:bg-gray-500"
        >
          ← Back
        </button>
        <h1 className="text-md lg:text-2xl font-bold pb-4">{item.title}</h1>

        <p className="mt-4 text-sm lg:text-lg">{item.snippet}</p>
        <p className="pt-4">
          <a
            href={item.link}
            target="_blank"
            className="text-blue-600 underline "
          >
            Visit Link
          </a>
        </p>
      </div>
    </section>
  );
};

export default LinkDetail;
