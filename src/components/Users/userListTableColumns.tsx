import type { User } from "@/api/types/users";
import type { ColumnDef } from "@tanstack/react-table";
import { Coins } from "lucide-react";

export const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        return (
          <span>{row.original.username}</span> 
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <span>{row.original.email}</span> 
        );
      },
    },
    {
      accessorKey: "inviteCode",
      header: "Invite Code",
      cell: ({ row }) => {
        return (
          <span>{row.original.inviteCode}</span> 
        );
      },
    },
    {
      accessorKey: "wallet.balance", 
      header: "Coins",
      cell: ({ row }) => {
        const amount = parseFloat(row.original.wallet.balance);
     
        return (
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span>{amount}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "emailVerified",
      header: "Email Verified",
      cell: ({ row }) => {
        const verified = row.original.emailVerified; 
        return (
          <span>
            {verified ? "Verified" : "Unverified"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
  ];