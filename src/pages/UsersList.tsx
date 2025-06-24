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
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { columns } from "@/components/Users/userListTableColumns"
import type { User } from "@/api/types/users"
import { useUsersQuery } from "@/lib/queries/userQueries"
import { useUser } from "@/hooks/useUser"

export default function UsersList({
  columns: propColumns = columns,
}: {
  columns?: ColumnDef<User, unknown>[]
}) {
  const { data: user, isLoading: isAuthLoading } = useUser();

  const navigate = useNavigate()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { 
    data: usersResponse, 
    isLoading, 
    error,
    isFetching 
  } = useUsersQuery({
    page: currentPage,
    limit: pageSize,
    search: globalFilter || undefined,
  })
  
  const users = usersResponse?.data?.users || []
  const totalUsers = usersResponse?.total || 0
  const totalPages = Math.ceil(totalUsers / pageSize)

  const table = useReactTable({
    data: users,
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
  if (isAuthLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  const handleRowClick = (user: User) => {
    navigate(`/users/${user.id}`)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) 
  }

  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, totalUsers)

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
    <div className="w-full min-h-screen p-8 bg-gray-100">
      <div className="">
        <div className="flex flex-col w-full py-4 gap-4">
          <h2 className="font-bold text-xl">Hello {user?.name} 👋,</h2>
          
        </div>
        
        <div className="bg-white p-6 mt-8 rounded-2xl">
          {/* Table Header with Title and Search */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
              {isFetching && (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              )}
            </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search users..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(String(event.target.value))}
                  className="pl-10 w-80"
                />
              </div>
         
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="text-gray-500">Loading users...</p>
              </div>
            </div>
          ) : (
            <>
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
                  {users?.length ? (
                    users.map((user: User, index: number) => (
                      <TableRow
                        key={user.id}
                        className={`
                          border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer
                          ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
                        `}
                        onClick={() => handleRowClick(user)}
                      >
                        {table.getHeaderGroups()[0].headers.map((header) => (
                          <TableCell 
                            key={header.id}
                            className="py-4 px-6"
                          >
                            {flexRender(
                              header.column.columnDef.cell, 
                              { ...header.getContext(), row: { original: user } }
                            )}
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
                          <div className="text-4xl">📋</div>
                          <div className="text-lg font-medium">No users found</div>
                          <div className="text-sm">
                            {globalFilter ? 'Try adjusting your search criteria' : 'No users available'}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-gray-600">
                  Showing {totalUsers > 0 ? startIndex : 0} to {endIndex} of {totalUsers} users
                </div>
                <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  
                  <span className="flex items-center gap-1 text-sm">
                    Page
                    <strong>
                      {currentPage} of {totalPages || 1}
                    </strong>
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronsRight size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}