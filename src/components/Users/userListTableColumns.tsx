import type { UserTable } from "@/store/schemas/user.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Coins } from "lucide-react";

export const columns: ColumnDef<UserTable>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        return <div className="font-semibold ">{row.getValue("username")}</div>
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <div className="text-gray-600">{row.getValue("email")}</div>
      },
    },
    {
      accessorKey: "coin",
      header: "Coins",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("coin"));
     
        return (
          <div className="font-bold text-sm flex gap-1 text-center">
            {amount}
            <Coins className="text-yellow-600" />
          </div>
        );
      },
    },
    {
      accessorKey: "emailVerified",
      header: "Verified",
      cell: ({ row }) => {
        const verified = row.getValue("emailVerified");
        return (
          <div className={`px-3 py-1 rounded-full text-sm font-semibold text-center w-fit ${
            verified 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {verified ? "Verified" : "Unverified"}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div className="text-gray-500 text-sm">{date.toLocaleDateString()}</div>;
      },
    },
  ];
  