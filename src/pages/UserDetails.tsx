import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/helpers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import InvitedUsersTable from "@/components/Users/InvitedUsersTable"
import CoinTransactionTable from "@/components/Users/CoinTransactionTable"
import { useUserQuery } from "@/lib/queries/userQueries"
import EditUserModal from "@/components/modals/EditUserModal"
import DeleteUserModal from "@/components/modals/DeleteUserModal"
import DeactivateInviteCodeModal from "@/components/modals/DeactivateInviteCodeModal"
import ActivateInviteCodeModal from "@/components/modals/ActivateInviteCodeModal"
import ChangeInviteCodeModal from "@/components/modals/ChangeInviteCodeModal"
import AddCoinsModal from "@/components/modals/addCoinsModal"

const UserDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeactivateCodeDialogOpen, setIsDeactivateCodeDialogOpen] = useState(false)
  const [isActivateCodeDialogOpen, setIsActivateCodeDialogOpen] = useState(false)
  const [isChangeCodeDialogOpen, setIsChangeCodeDialogOpen] = useState(false)
  const [isAddCoinsDialogOpen, setIsAddCoinsDialogOpen] = useState(false)

  //i can use team?.color to design the page of the user details
 
  const { data: userDetails, isLoading: isUserLoading } = useUserQuery(id || '');
  

  if (isUserLoading ) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-3xl animate-pulse mb-2">⏳</div>
          <p className="text-lg font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }
  

  if (!userDetails?.data.fan) {
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

  const { name, email, emailVerified, fanSince, teamId, squadNumber, username, inviteCode, referrerCode, createdAt, updatedAt, inviteDeactivated, teams, wallet} = userDetails.data.fan

  const getVerificationBadge = (verified: boolean, label: string) => (
    <div className={` flex items-center w-fit ${verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} `}>
      {verified ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
      {label} {verified ? "Verified" : "Unverified"}
    </div>
  )

  const showEditModal = () => {
    setIsEditModalOpen(true)
  }

  const showDeleteDialog = () => {
    setIsDeleteDialogOpen(true)
  }

  const showDeactivateCodeDialog = () => {
    setIsDeactivateCodeDialogOpen(true)
  }

  const showActivateCodeDialog = () => {
    setIsActivateCodeDialogOpen(true)
  }

  const showChangeCodeDialog = () => {
    setIsChangeCodeDialogOpen(true)
  }

  const handleShowAddCoinsModal = () => {
    setIsAddCoinsDialogOpen(true)
  }

  const editUserDetails = {
    username, 
    email, 
    fanSince, 
    squadNumber,
    teamId
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
          <DropdownMenuItem onClick={()=> handleShowAddCoinsModal()}>
            Add Coins
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={()=> showDeactivateCodeDialog()}> Deactivate Invite Code</DropdownMenuItem>
        <DropdownMenuItem onClick={()=> showActivateCodeDialog()}>Activate Invite Code</DropdownMenuItem>
        <DropdownMenuItem onClick={()=> showChangeCodeDialog()}>Change Invite Code</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={()=> showDeleteDialog()}>
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
                  {username}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <p className="mt-1 text-gray-900">{name}</p>
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <p className="mt-1 text-gray-900">@{username}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <p className="mt-1 text-gray-900">{email}</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="squadNumber">Squad Number</Label>
                    <p className="mt-1 text-gray-900">#{squadNumber}</p>
                  </div>
                  <div>
                    <Label htmlFor="coinBalance">Coin Balance</Label>
                    <p className="mt-1 text-gray-900">{wallet?.balance || 0} coins</p>
                  </div>
                  <div>
                    <Label>User's Invite Code</Label>
                    <p className="mt-1 font-mono text-gray-900">{inviteCode}</p>
                  </div>
                  <div>
                    <Label>Invite Code Used</Label>
                    <p className="mt-1 font-mono text-gray-900">{referrerCode || 'None'}</p>
                  </div>
                  <div>
                    <Label>Email Verification</Label>
                    <p className="text-sm text-gray-600"> {getVerificationBadge(emailVerified, "Email")}</p>
                  </div>
                <div>
                  <Label>Fan Since</Label>
                  <p className="text-sm text-gray-900">{fanSince}</p>
                </div>

                <div>
                  <Label>Account Created</Label>
                  <p className="text-sm text-gray-900">{formatDate(new Date(createdAt))}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-sm text-gray-900">{formatDate(new Date(updatedAt))}</p>
                </div>
                <div>
                  <Label>Team </Label>
                  <p className="text-sm font-mono text-gray-900">{teams?.name}</p>
                </div>
                <div>
                  <Label>Invite Code Deactivated </Label>
                  <p className="text-sm font-mono text-gray-900">{inviteDeactivated ? 'True': 'False'}</p>
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
    <InvitedUsersTable referrerCode={inviteCode} />
  </TabsContent>
  {id &&
  <TabsContent value="coinTransactions"><CoinTransactionTable id={id}/></TabsContent>
  }
</Tabs>
        </div>
        <EditUserModal 
            id={id}
          user={editUserDetails} 
          isOpen={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen}
        />
        <DeleteUserModal   
        id={id}
        isOpen={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen} />
            <DeactivateInviteCodeModal   
        id={id}
        isOpen={isDeactivateCodeDialogOpen} 
          onOpenChange={setIsDeactivateCodeDialogOpen} />
            <ActivateInviteCodeModal   
        id={id}
        isOpen={isActivateCodeDialogOpen} 
          onOpenChange={setIsActivateCodeDialogOpen} />
                <ChangeInviteCodeModal   
        id={id}
        isOpen={isChangeCodeDialogOpen} 
          onOpenChange={setIsChangeCodeDialogOpen} />

<AddCoinsModal   
        id={id}
        isOpen={isAddCoinsDialogOpen} 
          onOpenChange={setIsAddCoinsDialogOpen} />
    </div>
  )
}
export default UserDetails