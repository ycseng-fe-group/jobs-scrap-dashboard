import { useJobPostingsContext as useJobPostings } from "@/context/JobPostingsContext";
import FilterPanel from "@/components/filters/FilterPanel";
import ActiveFilters from "@/components/filters/ActiveFilters";
import TopBar from "@/components/layout/TopBar";
import JobTable from "@/components/table/JobTable";
import Spinner from "@/components/ui/Spinner";

export default function ListPage() {
  const { postings, loading, error, filters, setFilters } = useJobPostings();

  if (loading) return <Spinner />;
  if (error) return <div className="p-6 text-red-500">오류: {error}</div>;

  return (
    <div className="flex flex-col lg:flex-row">
      <FilterPanel filters={filters} setFilters={setFilters} />
      <div className="flex-1 flex flex-col">
        <TopBar
          search={filters.search}
          onSearch={(v) => setFilters({ ...filters, search: v })}
        />
        <div className="flex-1 p-4 sm:p-6">
          <ActiveFilters
            techs={filters.techs}
            onRemove={(tech) =>
              setFilters({ ...filters, techs: filters.techs.filter((t) => t !== tech) })}
            onClear={() => setFilters({ ...filters, techs: [] })}
          />
          <JobTable postings={postings} />
        </div>
      </div>
    </div>
  );
}
