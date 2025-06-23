import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from '@tanstack/react-query'
import type { LoggedInUser } from "@/api/types/auth"
import type { Fixture } from "@/store/schemas/fixture.schema"
import { columns } from "@/components/Fixtures/fixturesListTableColumns"
import { useFixturesQuery } from "@/lib/queries/fixtureQueries"

export default function FixturesList({
  columns: propColumns = columns,
}: {
  columns?: ColumnDef<Fixture, unknown>[]
}) {
  const queryClient = useQueryClient()
  const user: LoggedInUser | undefined = queryClient.getQueryData(['user'])
  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { 
    data: fixturesResponse, 
    isLoading, 
    error,
    isFetching 
  } = useFixturesQuery({
    page: currentPage,
    limit: pageSize,
    search: globalFilter || undefined,
  })
  const fixtures = fixturesResponse?.data?.fixtures || []
  const totalFixtures = fixturesResponse?.total || 0
  const totalPages = Math.ceil(totalFixtures / pageSize)

  console.log("fixturesResponse", fixturesResponse)

  const table = useReactTable({
    data: fixtures,
    columns: propColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true, 
    manualFiltering: true, 
    pageCount: totalPages,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value)
      setCurrentPage(1) 
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
  })

  const handleRowClick = (fixture: Fixture) => {
    navigate(`/fixtures/${fixture.ID}`)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) 
  }

  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalFixtures)

  if (error) {
    return (
      <div className="w-full p-8 bg-gray-100">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load users: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="w-full p-8 bg-gray-100">
      <div className="">
        <div className="flex flex-col w-full py-4 gap-4">
          <h2 className="font-bold text-xl">Hello {user?.name} 👋,</h2>
        </div>
        
        <div className="bg-white p-6 rounded-2xl">
          {/* Table Header with Title and Search */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">All Fixtures</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search fixtures..."
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
                      border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
                    `}
                    onClick={() => handleRowClick(row.original)}
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
                    colSpan={propColumns.length} 
                    className="h-32 text-center text-gray-500 bg-gray-50"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="text-4xl">⚽</div>
                      <div className="text-lg font-medium">No fixtures found</div>
                      <div className="text-sm">Try adjusting your search criteria</div>
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
              of {table.getFilteredRowModel().rows.length} fixtures
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
      </div>
    </div>
  )
}