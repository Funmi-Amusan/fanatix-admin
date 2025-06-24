import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2, Filter as FilterIcon } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { columns as defaultColumns } from '@/components/Fixtures/fixturesListTableColumns'
import { fixtureEndpoints } from '@/api/endpoints'

interface FixturesListProps {
  columns?: ColumnDef<Fixture, unknown>[]
}

export default function FixturesList({ columns = defaultColumns }: FixturesListProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['user']) as any

  const bottomRef = useRef<HTMLDivElement | null>(null)


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['fixtures'],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) =>
      fixtureEndpoints.fetchFixtures({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, pages) => {
      const current = lastPage.meta?.currentPage ?? pages.length
      const total = lastPage.meta?.totalPages ?? 1
      return current < total ? current + 1 : undefined
    },
  })
  

  const fixtures = useMemo(() => data?.pages.flatMap(p => p.data.fixtures ?? []) ?? [], [data])

  const table = useReactTable({
    data: fixtures,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
  }, [bottomRef.current, hasNextPage, isFetchingNextPage])

  const handleRowClick = (fixture: Fixture) => {
    navigate(`/fixtures/${fixture.ID}`)
  }

  return (
    <div className="w-full p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Hello {user?.name} 👋</h2>
       
      </div>

      <div className="bg-white p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Fixtures</h1>
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          )}
        </div>

        {error ? (
          <div className="text-center text-red-600">⚠️ Failed to load fixtures.</div>
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
                        className={`py-4 px-6 font-semibold text-left ${
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
                {fixtures.length > 0 ? (
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
                      <div className="text-4xl">⚽</div>
                      <p className="text-lg font-medium">No fixtures found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div ref={bottomRef} className="h-16 mt-6 flex justify-center items-center">
              {isFetchingNextPage && (
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more fixtures...
                </span>
              )}
              {!hasNextPage && fixtures.length > 0 && (
                <span className="text-gray-400 text-sm">
                  Showing all {fixtures.length} fixture{fixtures.length !== 1 && 's'}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
