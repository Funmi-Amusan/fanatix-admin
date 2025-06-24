import { Badge, Filter, Loader2, Search, X } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import { Input } from '../ui/input';
import { invitedUsersColumns } from './invitedUsersColumns';
import { userEndpoints } from '@/api/endpoints';
import { UserDisplayTable } from './InvitedUserDisplayTable';
import type { FetchUsersParams } from '@/api/types/users';
import { Button } from '../ui/button';
import { FilterModal } from '../modals/filterModal';

interface InvitedUserTableProps {
  referrerCode: string;
}

const pageSize = 10;

const InvitedUserTable = ({ referrerCode }: InvitedUserTableProps) => {
  const [filters, setFilters] = useState<Partial<FetchUsersParams>>({});
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300);
    return () => clearTimeout(timeout);
  }, [globalFilter]);

  const stableFiltersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const stableSortKey = useMemo(() => JSON.stringify(sorting), [sorting]);
  const queryKey = useMemo(() => ['users', referrerCode, debouncedGlobalFilter, stableFiltersKey, stableSortKey], [
    referrerCode,
    debouncedGlobalFilter,
    stableFiltersKey,
    stableSortKey,
  ]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const sortParam = sorting.length ? { sort_by_oldest: sorting[0].desc } : {};
      const result = await userEndpoints.fetchUsers({
        page: pageParam,
        limit: pageSize,
        referrer_code: referrerCode,
        search: debouncedGlobalFilter || undefined,
        ...filters,
        ...sortParam,
      });

      if (!Array.isArray(result?.data?.users)) {
        return { data: { users: [] }, meta: { totalPages: 0, currentPage: pageParam } };
      }

      return result;
    },
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage?.meta?.totalPages || 1;
      const currentPage = lastPage?.meta?.currentPage || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    placeholderData: prev => prev,
    retry: false,
  });

  const users = useMemo(() => data?.pages.flatMap(page => page.data.users ?? []) ?? [], [data]);

  const table = useReactTable({
    data: users,
    columns: invitedUsersColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const removeFilter = (filterKey: keyof FetchUsersParams) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    const currentRef = bottomRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const showSpinner = isLoading && !data;

  return (
    <div className="bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Invited Users</h1>
          <Button variant="outline" onClick={() => setFilterModalOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search invited users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 w-80"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(filters).map(([key, value]) => (
          <Badge key={key} variant="secondary" className="capitalize">
            {key.replace('_', ' ')}: {String(value)}
            <button onClick={() => removeFilter(key as keyof FetchUsersParams)} className="ml-2 hover:text-red-600">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {Object.keys(filters).length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
            Clear All
          </Button>
        )}
      </div>

      {error && (
        <div className="text-center text-red-600 mb-4">
          ⚠️ Failed to load users. Please check the console or try again later.
        </div>
      )}

      {showSpinner ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading invited users...</p>
          </div>
        </div>
      ) : (
        <UserDisplayTable
          table={table}
          users={users}
          bottomRef={bottomRef}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          debouncedGlobalFilter={debouncedGlobalFilter}
        />
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApplyFilters={setFilters}
        currentFilters={filters}
      />
    </div>
  );
};

export default InvitedUserTable;
