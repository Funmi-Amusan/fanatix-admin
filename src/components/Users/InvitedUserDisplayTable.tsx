import React from 'react';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import type { User } from '@/api/types/users';


interface UserDisplayTableProps {
  table: TanstackTable<User>;
  users: User[];
  bottomRef: React.RefObject<HTMLDivElement|null>;
  isFetchingNextPage: boolean;
  hasNextPage: boolean | undefined;
}

export const UserDisplayTable = React.memo(({
  table,
  users,
  bottomRef,
  isFetchingNextPage,
  hasNextPage
}: UserDisplayTableProps) => {
  return (
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
                      asc: '🔼',
                      desc: '🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="py-4 px-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="text-center py-12 text-gray-500">
              <>
                    <div className="text-xl mb-2">👥</div>
                    <p>No invited users yet</p>
                  </>
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
          <span className="text-gray-400 text-sm">All {users.length} user{users.length !== 1 ? 's' : ''} loaded</span>
        )}
      </div>
    </>
  );
});

UserDisplayTable.displayName = 'UserDisplayTable';