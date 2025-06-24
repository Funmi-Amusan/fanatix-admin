import {
    useInfiniteQuery,
  } from '@tanstack/react-query';
  import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
  } from '@tanstack/react-table';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Loader2 } from 'lucide-react';
  import { useEffect, useMemo, useRef } from 'react';
import { fixtureEndpoints } from '@/api/endpoints/fixtureEndpoints';
  
  interface ChatRoomUser {
    id: string;
    teamId: string;
    fanSince: number;
    squadNumber: number;
    username: string;
    team: {
      ID: string;
      name: string;
      imageURL: string;
      externalID: string;
      color: string;
    };
  }
  
  interface Props {
    fixtureId: number;
  }
  
  const pageSize = 10;
  
  export default function FixtureChatRoomUsersTable({ fixtureId }: Props) {
    const bottomRef = useRef<HTMLDivElement | null>(null);
  
    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      error,
    } = useInfiniteQuery({
      queryKey: ['fixture-chatroom-users', fixtureId],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await fixtureEndpoints.fetchFixtureChatRoomUsers(fixtureId, {
          page: pageParam,
          limit: pageSize,
        });
        return {
          ...response,
          data: {
            ...response.data,
            users: response.data?.users ?? [],
          },
        };
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        const current = pages.length;
        const total = Math.ceil(lastPage?.data?.users?.length / pageSize) || 1;
        return current < total ? current + 1 : undefined;
      },      enabled: !!fixtureId,
      staleTime: 5 * 60 * 1000,
    });
  
    const users = useMemo(
      () => data?.pages.flatMap(p => p.data.users) ?? [],
      [data]
    );
  
    const columns = useMemo<ColumnDef<ChatRoomUser, unknown>[]>(() => [
      {
        accessorKey: 'username',
        header: 'Username',
      },
      {
        accessorKey: 'team.name',
        header: 'Team',
        cell: ({ row }) => row.original.team.name,
      },
      {
        accessorKey: 'squadNumber',
        header: 'Squad #',
      },
      {
        accessorKey: 'fanSince',
        header: 'Fan Since',
      },
    ], []);
  
    const table = useReactTable({
      data: users,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
  
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
  
      const el = bottomRef.current;
      if (el) observer.observe(el);
  
      return () => {
        if (el) observer.unobserve(el);
      };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
    if (isLoading) {
      return (
        <div className="p-6 text-center text-gray-500">
          <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
          Loading users...
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="p-6 text-center text-red-600">
          ⚠️ Failed to load chat room users. Please try again later.
        </div>
      );
    }
  
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Chat Room Users</h2>
  
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="py-2 px-4 text-left font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-2 px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                  No users found in this chat room.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
  
        <div ref={bottomRef} className="h-16 mt-6 flex justify-center items-center">
          {isFetchingNextPage && (
            <span className="text-sm flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more users...
            </span>
          )}
        </div>
      </div>
    );
  }