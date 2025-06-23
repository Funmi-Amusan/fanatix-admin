import { formatDate } from "@/lib/helpers";
import type { Fixture } from "@/store/schemas/fixture.schema";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Fixture>[] = [
  {
    accessorKey: "fixtureId",
    header: "Fixture ID",
    cell: ({ row }) => {
      return (
        <span>{row.original.external_id}</span> 
      );
    },
  },
  {
    accessorKey: "homeTeamName",
    header: "Home Team",
    cell: ({ row }) => {
      const homeTeam = row.original.Participants.find(
        (participant: Participant) => participant.Home
      );
      return <span>{homeTeam ? homeTeam.Name : "N/A"}</span>;
    },
  },
  {
    accessorKey: "awayTeamName",
    header: "Away Team",
    cell: ({ row }) => {
      const awayTeam = row.original.Participants.find(
        (participant: Participant) => !participant.Home
      );
      return <span>{awayTeam ? awayTeam.Name : "N/A"}</span>;
    },
  },
  {
    accessorKey: "completed",
    header: "Completed",
    cell: ({ row }) => {
      return (
        <span>{row.original.Completed? "True": "False"}</span> 
      );
    },
  },
  {
    accessorKey: "matchState",
    header: "Status", 
    cell: ({ row }) => {
      return (
        <span>{row.original.MatchState}</span> 
      );
    },
  },
  {
    accessorKey: "matchStartTime",
    header: "Match Time",
    cell: ({ row }) => {
      return (
        <span>{formatDate(new Date(row.original.start_time))}</span> 
      );
    },
  },
  {
    accessorKey: "leagueName",
    header: "League",
    cell: ({ row }) => {
      return (
        <span>{row.original.League.Name}</span> 
      );
    },
  },
];