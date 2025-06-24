import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  useReactTable, 
  flexRender,
  type ColumnFiltersState, 
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { coinTransactionColumns } from './coinTransactionColumns'
import { useTransactionsQuery } from '@/lib/queries/transactionQueries'

const CoinTransactionTable = ({id}: {id: string}) => {
  console.log('id', id)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const { data: allTransactions, isLoading, isError, error } = useTransactionsQuery(id, { page: 1, limit: 10 });

  const data = allTransactions?.data?.transactions ?? [];

    const table = useReactTable({
      data,
      columns: coinTransactionColumns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      state: {
        sorting,
        columnFilters,
        globalFilter,
      },
      initialState: {
        pagination: {
          pageSize: 10,
        },
      },
    })

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="animate-pulse text-lg">Loading transactions...</div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-6 text-center text-red-600">
        <p className="text-lg font-semibold">Failed to load transactions</p>
        <p className="text-sm">{(error as Error)?.message ?? "Something went wrong."}</p>
      </div>
    );
  }
  


  return (
    <div className="bg-white p-6 rounded-2xl">
      {/* Table Header with Title and Search */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coin Transactions</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search transactions..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="pl-10 w-80"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-gray-200 hover:bg-gray-100">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead 
                    key={header.id} 
                    className="font-semibold text-gray-900 py-4 px-6 text-left"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center gap-1'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`
                  border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell 
                    key={cell.id}
                    className="py-4 px-6"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell 
                colSpan={coinTransactionColumns.length} 
                className="h-32 text-center text-gray-500 bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-4xl">💰</div>
                  <div className="text-lg font-medium">No transactions found</div>
                  <div className="text-sm">This user has no coin transactions yet</div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-600">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} transactions
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} />
          </Button>
          
          <span className="flex items-center gap-1 text-sm">
            Page
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
export default CoinTransactionTable