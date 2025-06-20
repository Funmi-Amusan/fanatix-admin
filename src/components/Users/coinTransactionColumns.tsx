import type { CoinTransaction } from "@/store/schemas/interfaces";
import type { ColumnDef } from "@tanstack/react-table";

export const coinTransactionColumns: ColumnDef<CoinTransaction>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("id")}</div>
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const isPositive = amount > 0;
      
      return (
        <div className={`font-bold text-sm flex items-center gap-1 ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? '+' : ''}{amount}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className={`px-3 py-1 rounded-full text-sm font-semibold text-center w-fit ${
          type === 'credit' 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <div className="text-gray-600">{row.getValue("description")}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-gray-500 text-sm">{date.toLocaleDateString()}</div>;
    },
  },
];
  