import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  Edit, 
  Users2, 
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { mockUsers } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import InvitedUsersTable from "@/components/Users/InvitedUsersTable"
import CoinTransactionTable from "@/components/Users/CoinTransactionTable"

const UserDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const user = mockUsers.find(u => u.id === id)


  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">User Not Found</h2>
          <p className="text-gray-500 mb-4">The user you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/users')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  const getVerificationBadge = (verified: boolean, label: string) => (
    <div className={` flex items-center w-fit ${verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} `}>
      {verified ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
      {label} {verified ? "Verified" : "Unverified"}
    </div>
  )

  const showEditModal = () => {
  }
  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full ">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/users')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
           
          </div>
          
          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><Edit />Edit</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=> showEditModal()}>
            Edit User Details
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Verify User
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem> Deactivate Invite Code</DropdownMenuItem>
        <DropdownMenuItem>Generate New Invite Code</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
        Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        </div>
        <div className=" flex flex-col gap-8">
          <div className="">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  {user.username}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <p className="mt-1 text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <p className="mt-1 text-gray-900">@{user.username}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="squadNumber">Squad Number</Label>
                    <p className="mt-1 text-gray-900">#{user.squadNumber}</p>
                  </div>
                  <div>
                    <Label htmlFor="coinBalance">Coin Balance</Label>
                    <p className="mt-1 text-gray-900">{user.coin} coins</p>
                  </div>
                  <div>
                    <Label>User's Invite Code</Label>
                    <p className="mt-1 font-mono text-gray-900">{user.inviteCode}</p>
                  </div>
                  <div>
                    <Label>Invite Code Used</Label>
                    <p className="mt-1 font-mono text-gray-900">{user.inviteCodeUsed || 'None'}</p>
                  </div>
                  <div>
                    <Label>Email Verification</Label>
                    <p className="text-sm text-gray-600"> {getVerificationBadge(user.emailVerified, "Email")}</p>
                  </div>
                <div>
                  <Label>Fan Since</Label>
                  <p className="text-sm text-gray-900">{formatDate(user.fanSince)}</p>
                </div>

                <div>
                  <Label>Account Created</Label>
                  <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
                </div>
                <div>
                  <Label>Team ID</Label>
                  <p className="text-sm font-mono text-gray-900">{user.teamId}</p>
                </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="invitedUsers" className="w-full ">
  <TabsList>
    <TabsTrigger value="invitedUsers">Invited Users</TabsTrigger>
    <TabsTrigger value="coinTransactions">Coin Transactions</TabsTrigger>
  </TabsList>
  <TabsContent value="invitedUsers">
    <InvitedUsersTable />
  </TabsContent>
  <TabsContent value="coinTransactions"><CoinTransactionTable /></TabsContent>
</Tabs>
      
        </div>
    </div>
  )
}

export default UserDetails