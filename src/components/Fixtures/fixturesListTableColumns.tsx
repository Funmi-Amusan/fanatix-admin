import type { Fixture } from "@/store/schemas/fixture.schema";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Fixture>[] = [
  {
    accessorKey: "fixtureId",
    header: "Fixture ID",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("fixtureId")}</div>;
    },
  },
  {
    accessorKey: "homeTeamName",
    header: "Home Team",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <img 
            src={row.original.homeTeamImageUrl} 
            alt={row.getValue("homeTeamName")} 
            className="w-6 h-6 rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span>{row.getValue("homeTeamName")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "awayTeamName",
    header: "Away Team",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <img 
            src={row.original.awayTeamImageUrl} 
            alt={row.getValue("awayTeamName")} 
            className="w-6 h-6 rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span>{row.getValue("awayTeamName")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "homeScore",
    header: "Score",
    cell: ({ row }) => {
      const homeScore = row.getValue("homeScore") as number;
      const awayScore = row.original.awayScore;
      const isCompleted = row.original.Completed;
      
      return (
        <div className="font-mono font-semibold">
          {isCompleted ? `${homeScore} - ${awayScore}` : "- : -"}
        </div>
      );
    },
  },
  {
    accessorKey: "matchState",
    header: "Status", 
    cell: ({ row }) => {
      const matchState = row.getValue("matchState") as string;
      const isCompleted = row.original.Completed;
      
      const getStatusBadge = () => {
        if (!isCompleted) {
          return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Upcoming</span>;
        }
        
        switch (matchState) {
          case 'FT':
            return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Full Time</span>;
          case 'HT':
            return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Half Time</span>;
          default:
            return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{matchState}</span>;
        }
      };
      
      return getStatusBadge();
    },
  },
  {
    accessorKey: "matchStartTime",
    header: "Match Time",
    cell: ({ row }) => {
      const date = row.getValue("matchStartTime") as Date;
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-gray-500">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "leagueName",
    header: "League",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <img 
            src={row.original.leagueImageUrl} 
            alt={row.getValue("leagueName")} 
            className="w-5 h-5 rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-sm">{row.getValue("leagueName")}</span>
        </div>
      );
    },
  },
];