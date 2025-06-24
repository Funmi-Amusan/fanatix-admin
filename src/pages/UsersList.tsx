import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Loader2,
  Filter as FilterIcon,
} from 'lucide-react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useNavigate } from 'react-router-dom'
import { columns as defaultColumns } from '@/components/Users/userListTableColumns'
import { FilterModal } from '@/components/modals/filterModal'
import { userEndpoints } from '@/api/endpoints'
import type { User, FetchUsersParams } from '@/api/types/users'

interface UsersListProps {
  columns?: ColumnDef<User, unknown>[]
}

export default function UsersList({ columns = defaultColumns }: UsersListProps) {
  const { data: user, isLoading: isAuthLoading } = useUser()
  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<Partial<FetchUsersParams>>({})
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  const stableSortKey = useMemo(() => JSON.stringify(sorting), [sorting])
  const stableFilterKey = useMemo(() => JSON.stringify(filters), [filters])

  const queryKey = useMemo(() => ['users', stableSortKey, stableFilterKey], [
    stableSortKey,
    stableFilterKey,
  ])

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
      const sortParam = sorting.length > 0 ? { sort_by_oldest: sorting[0].desc } : {}
      const result = await userEndpoints.fetchUsers({
        page: pageParam,
        limit: 10,
        ...filters,
        ...sortParam,
      })
      return result
    },
    getNextPageParam: (lastPage, allPages) => {
      const current = lastPage?.meta?.currentPage ?? allPages.length
      const total = lastPage?.meta?.totalPages ?? 1
      return current < total ? current + 1 : undefined
    },
    placeholderData: prev => prev,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const users = useMemo(() => data?.pages.flatMap(p => p.data.users ?? []) ?? [], [data])

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })

    const ref = bottomRef.current
    if (ref) observer.observe(ref)
    return () => ref && observer.unobserve(ref)
  }, [bottomRef.current, hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleRowClick = (user: User) => {
    navigate(`/users/${user.id}`)
  }

  if (isAuthLoading) return <div>Loading...</div>
  if (!user) return <div>Please login</div>

  return (
    <div className="w-full min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Hello {user.name} 👋</h2>
        <Button variant="outline" onClick={() => setFilterModalOpen(true)}>
          <FilterIcon className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
            {isFetching && (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          {Object.keys(filters).length > 0 && (
  <div className="flex flex-wrap gap-2 mt-2 mb-4">
    {Object.entries(filters).map(([key, value]) => (
      <div key={key} className="bg-gray-100 text-sm px-3 py-1 rounded-full text-gray-700 border">
        {key.replace(/_/g, ' ')}: {String(value)}
      </div>
    ))}
    <Button variant="ghost" size="sm" onClick={() => setFilters({})}>
      Clear All Filters
    </Button>
  </div>
)}

        </div>

        {error ? (
          <div className="text-center text-red-600">⚠️ Failed to load users.</div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64 flex-col gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        className={`py-4 px-6 text-left font-semibold ${
                          header.column.getCanSort() ? 'cursor-pointer hover:underline' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(row.original)}
                    >
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id} className="py-4 px-6">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-12 text-gray-500">
                      <div className="text-xl mb-2">👥</div>
                      <p>No users match your filter.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div ref={bottomRef} className="h-16 mt-6 flex justify-center items-center">
              {isFetchingNextPage && (
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more users...
                </span>
              )}
              {!hasNextPage && users.length > 0 && (
                <span className="text-gray-400 text-sm">
                  Showing all {users.length} user{users.length !== 1 && 's'}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  )
}
