
import type { Transaction } from "@/api/types/transactions";
import type { ColumnDef } from "@tanstack/react-table";
import { Coins } from "lucide-react";

export const coinTransactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "ID",
    header: " ID",
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("ID")}</div>
    },
  },
  {
    accessorKey: "Amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <span>{row.getValue("Amount")}</span>
          <Coins className="h-4 w-4 text-yellow-600" />
        </div>
      );
    },
  },
  {
    accessorKey: "Credit",
    header: "Transaction Type",
    cell: ({ row }) => {
      const isCredit = row.getValue("Credit") as boolean;
      const label = isCredit ? 'credit' : 'debit';
      const styles = isCredit 
        ? "bg-green-100 text-green-800" 
        : "bg-red-100 text-red-800";
  
      return (
        <div className={`px-3 py-1 rounded-full text-sm font-semibold text-center w-fit ${styles}`}>
          {label}
        </div>
      );
    },
  },
  {
    accessorKey: "Title",
    header: "Title",
    cell: ({ row }) => {
      return <div className="text-gray-600">{row.getValue("Title")}</div>
    },
  },  
  {
    accessorKey: "Description",
    header: "Description",
    cell: ({ row }) => {
      return <div className="text-gray-600">{row.getValue("Description")}</div>
    },
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("Status") as string)?.toLowerCase();
  
      let styles = "";
      switch (status) {
        case "success":
          styles = "bg-green-100 text-green-800";
          break;
        case "pending":
          styles = "bg-yellow-100 text-yellow-800";
          break;
        case "failed":
          styles = "bg-red-100 text-red-800";
          break;
        default:
          styles = "bg-gray-100 text-gray-600";
          break;
      }
  
      return (
        <div className={`px-3 py-1 rounded-sm text-sm font-semibold text-center w-fit ${styles}`}>
          {status}
        </div>
      );
    },
  },  
  {
    accessorKey: "CreatedAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("CreatedAt"));
      return <div className="text-gray-500 text-sm">{date.toLocaleDateString()}</div>;
    },
  },
];
  