import type { ChangeEvent } from "react";

interface SearchInputProps {
  searchTerm: string;
  changeFunction: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput = ({ searchTerm, changeFunction }: SearchInputProps) => {
  return (
    <input
      placeholder="Search..."
      className="my-4 mx-auto px-2 border-white border-2 rounded-md"
      value={searchTerm}
      onChange={changeFunction}
    />
  );
};

export default SearchInput;
