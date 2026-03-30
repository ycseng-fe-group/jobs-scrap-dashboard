interface Props {
  search: string;
  onSearch: (v: string) => void;
  lastUpdated?: string;
}

export default function TopBar({ search, onSearch, lastUpdated }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-6 py-3 bg-white border-b border-gray-200">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="회사명, 공고명 검색..."
        className="w-full sm:w-72 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      {lastUpdated && (
        <span className="text-xs text-gray-400">마지막 업데이트: {lastUpdated}</span>
      )}
    </div>
  );
}
