type SearchBarProps = {
  city: string;
  setCity: (city: string) => void;
  onSearch: () => void;
};

function SearchBar({ city, setCity, onSearch }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={onSearch}>Search</button>
    </div>
  );
}

export default SearchBar;