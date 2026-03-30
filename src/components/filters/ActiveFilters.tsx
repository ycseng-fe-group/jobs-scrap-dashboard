interface Props {
  techs: string[];
  onRemove: (tech: string) => void;
  onClear: () => void;
}

export default function ActiveFilters({ techs, onRemove, onClear }: Props) {
  if (techs.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-xs text-gray-500">필터:</span>
      {techs.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
          {t}
          <button onClick={() => onRemove(t)} className="hover:text-blue-900">×</button>
        </span>
      ))}
      <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600 underline">초기화</button>
    </div>
  );
}
