import { Filter, Loader2, X } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import { invitedUsersColumns } from './invitedUsersColumns';
import { UserDisplayTable } from './InvitedUserDisplayTable';
import type { FetchUsersParams } from '@/api/types/users';
import { Button } from '../ui/button';
import { FilterModal } from '../modals/filterModal';
import { Badge } from '../ui/badge';
import { userEndpoints } from '@/api/endpoints/userEndpoints';

interface InvitedUserTableProps {
  referrerCode: string;
}

const pageSize = 10;

const InvitedUserTable = ({ referrerCode }: InvitedUserTableProps) => {
  const [filters, setFilters] = useState<Partial<FetchUsersParams>>({});
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);


  const stableFiltersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const stableSortKey = useMemo(() => JSON.stringify(sorting), [sorting]);
  const queryKey = useMemo(() => ['users', referrerCode, stableFiltersKey, stableSortKey], [
    referrerCode,
    stableFiltersKey,
    stableSortKey,
  ]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
      return Number(currentPage) < Number(totalPages) ? Number(currentPage) + 1 : undefined;
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
      columnFilters
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
          <h1 className="text-2xl font-bold text-gray-900">Invited Users</h1>
    
          <Button variant="outline" onClick={() => setFilterModalOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
     
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
