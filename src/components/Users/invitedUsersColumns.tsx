import type { InviteUsage } from "@/store/schemas/interfaces";
import type { ColumnDef } from "@tanstack/react-table";

export const invitedUsersColumns: ColumnDef<InviteUsage>[] = [
  {
    accessorKey: "usedBy",
    header: "Invited User ID",
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("usedBy")}</div>
    },
  },
  {
    accessorKey: "usedByEmail",
    header: "Invited User Email",
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("usedByEmail")}</div>
    },
  },
  {
    accessorKey: "usedByName",
    header: "Invited User Name",
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("usedByName")}</div>
    },
  },
  {
    accessorKey: "usedAt",
    header: "Used At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("usedAt"));
      return <div className="text-gray-500 text-sm">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "rewardGiven",
    header: "Coins Given",
    cell: ({ row }) => {
      return <div className="text-gray-500 text-sm">{row.getValue("rewardGiven")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div className="text-gray-500 text-sm">{row.getValue("status")}</div>;
    },
  },
];
  