import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
import type { UserTable } from "@/store/schemas/user.schema"
import { mockUsers } from "@/lib/data"
import { columns } from "./userListTableColumns"
import { ArrowUp, Users, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function UsersList({
  columns: propColumns = columns,
  data = mockUsers,
}: {
  columns?: ColumnDef<UserTable, unknown>[]
  data?: UserTable[]
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns: propColumns,
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

  const navigate = useNavigate()

  const handleRowClick = (user: UserTable) => {
    navigate(`/users/${user.id}`) 
  }

  return (
    <div className="w-full p-8 bg-gray-100">
      <div className="">
        <div className="flex flex-col w-full py-4 gap-4">
          <h2 className="font-bold text-xl">Hello Evano 👋,</h2>
          <div className="bg-white shadow-sm p-4 grid rounded-2xl grid-cols-3">
            <div className="flex gap-2 items-center">
              <div className="bg-emerald-200 text-emerald-600 rounded-full p-4">
                <Users size={32}/>
              </div>
              <div className="flex flex-col">
                <h4 className=" text-sm text-black/40">
                  Total Customers
                </h4>
                <p className="font-bold text-lg">5423</p>
                <p className="flex whitespace-nowrap text-xs items-center"> 
                  <span className="text-emerald-600 inline-flex pr-1">
                    <ArrowUp size={14} /> 16% 
                  </span> this month
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-emerald-200 text-emerald-600 rounded-full p-4">
                <Users size={32}/>
              </div>
              <div className="flex flex-col">
                <h4 className=" text-sm text-black/40">
                  Total Customers
                </h4>
                <p className="font-bold text-lg">5423</p>
                <p className="flex whitespace-nowrap text-xs items-center"> 
                  <span className="text-emerald-600 inline-flex pr-1">
                    <ArrowUp size={14} /> 16% 
                  </span> this month
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-emerald-200 text-emerald-600 rounded-full p-4">
                <Users size={32}/>
              </div>
              <div className="flex flex-col">
                <h4 className=" text-sm text-black/40">
                  Total Customers
                </h4>
                <p className="font-bold text-lg">5423</p>
                <p className="flex whitespace-nowrap text-xs items-center"> 
                  <span className="text-emerald-600 inline-flex pr-1">
                    <ArrowUp size={14} /> 16% 
                  </span> this month
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl">
          {/* Table Header with Title and Search */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
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
                      <div className="text-4xl">📋</div>
                      <div className="text-lg font-medium">No users found</div>
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
              of {table.getFilteredRowModel().rows.length} users
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