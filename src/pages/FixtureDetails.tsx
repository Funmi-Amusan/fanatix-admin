import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  Users2, 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockFixtureDetails } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import InvitedUsersTable from "@/components/Users/InvitedUsersTable"


const FixtureDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  if (!mockFixtureDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Fixture Not Found</h2>
          <p className="text-gray-500 mb-4">The fixture you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/fixtures')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Fixtures
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col gap-y-8 w-full ">

<div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/fixtures')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Fixtures
            </Button>
           
          </div>

        <div className=" flex flex-col gap-8">
          <div className="">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  {mockFixtureDetails.fixtureId}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8">
                  <div>
                    <Label htmlFor="name">Home Team</Label>
                    <p className="mt-1 text-gray-900">{mockFixtureDetails.homeTeamName}</p>
                  </div>
                  <div>
                    <Label htmlFor="username">Away Team</Label>
                    <p className="mt-1 text-gray-900">{mockFixtureDetails.awayTeamName}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Scores</Label>
                    <p className="mt-1 text-gray-900">{mockFixtureDetails.homeScore} vs {mockFixtureDetails.awayScore}</p>
                  </div>
                  <div>
                    <Label htmlFor="coinBalance">League</Label>
                    <p className="mt-1 text-gray-900">{mockFixtureDetails.leagueName}</p>
                  </div>
                  <div>
                    <Label>Match Start Time</Label>
                    <p className="mt-1 font-mono text-gray-900">{mockFixtureDetails.matchStartTime.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Match State</Label>
                    <p className="mt-1 font-mono text-gray-900">{mockFixtureDetails.matchState}</p>
                  </div>
              
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <InvitedUsersTable />
    </div>
  )
}

export default FixtureDetails