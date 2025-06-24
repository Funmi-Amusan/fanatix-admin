import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Loader2 } from 'lucide-react'
import { coinTransactionColumns } from './coinTransactionColumns'
import { useInfiniteQuery } from '@tanstack/react-query'
import { walletEndpoints } from '@/api/endpoints/walletEndpoints'
const pageSize = 10

const CoinTransactionTable = ({ id }: { id: string }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const stableSortKey = useMemo(() => JSON.stringify(sorting), [sorting])
  const queryKey = useMemo(() => ['transactions', id, stableSortKey], [
    id,
    stableSortKey,
  ])

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
      const result = await walletEndpoints.fetchTransactions(id, {
        page: pageParam,
        limit: pageSize,
      })
      return result
    },
    getNextPageParam: (lastPage, pages) => {
      const current = Number(lastPage?.meta?.currentPage ?? pages.length)
      const total = Number(lastPage?.meta?.totalPages ?? 1)
      return current < total ? current + 1 : undefined
    },
    retry: false,
    placeholderData: prev => prev,
    staleTime: 5 * 60 * 1000,
  })

  const transactions = useMemo(() => data?.pages.flatMap(p => p.data.transactions ?? []) ?? [], [data])

  const table = useReactTable({
    data: transactions,
    columns: coinTransactionColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualSorting: true,
    manualFiltering: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })
    const el = bottomRef.current
    if (el) observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [bottomRef, hasNextPage, isFetchingNextPage, fetchNextPage])
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="animate-pulse text-lg">Loading transactions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="text-lg font-semibold">Failed to load transactions</p>
        <p className="text-sm">{(error as Error)?.message ?? 'Something went wrong.'}</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coin Transactions</h1>
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search transactions..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 w-80"
          />
        </div> */}
      </div>

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
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b hover:bg-gray-100`}
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
              <TableCell colSpan={coinTransactionColumns.length} className="text-center py-12 text-gray-500">
                <div className="text-4xl">💰</div>
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm">This user has no coin transactions yet</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div ref={bottomRef} className="h-16 mt-6 flex justify-center items-center">
        {isFetchingNextPage && (
          <span className="text-sm flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more transactions...
          </span>
        )}
        {!hasNextPage && transactions.length > 0 && (
          <span className="text-sm text-gray-400">All {transactions.length} transaction(s) loaded</span>
        )}
      </div>
    </div>
  )

}
export default CoinTransactionTable
