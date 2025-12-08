import { Link } from "react-router-dom";
import type { SearchResultItem } from "../utils/types.ts";

interface ArticlesTableProps {
  data: SearchResultItem[];
}

const ArticlesTable = ({ data }: ArticlesTableProps) => {
  return (
    <table className="w-full border border-gray-300 rounded-md">
      <thead className="bg-gray-400">
        <tr>
          <th className="text-center p-2 border-b border-r-2">Title</th>
          <th className="text-center p-2 border-b">Link</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => (
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
  );
};

export default ArticlesTable;
