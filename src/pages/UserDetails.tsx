import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
  Pencil,
  Coins, 
  QrCode, 
  Trash2, 
  Loader2, 
  Frown,
  User, 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatClearDate } from "@/lib/helpers"
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

  const { data: userDetails, isLoading: isUserLoading } = useUserQuery(id || '');

  // Loading state with spinner
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-lg font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  // User not found state
  if (!userDetails?.data.fan) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <Frown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">User Not Found</h2>
          <p className="text-gray-500 mb-6">The user you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/users')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users List
          </Button>
        </div>
      </div>
    )
  }

  const { name, email, emailVerified, fanSince, squadNumber, username, inviteCode, referrerCode, createdAt, updatedAt, inviteDeactivated, teams, wallet} = userDetails.data.fan

  const getVerificationBadge = (verified: boolean, label: string) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${verified ? "bg-green-100 text-green-800" : "bg-red-110 text-red-800"} `}>
      {verified ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
      {label} {verified ? "Verified" : "Unverified"}
    </span>
  )

  const showEditModal = () => setIsEditModalOpen(true)
  const showDeleteDialog = () => setIsDeleteDialogOpen(true)
  const showDeactivateCodeDialog = () => setIsDeactivateCodeDialogOpen(true)
  const showActivateCodeDialog = () => setIsActivateCodeDialogOpen(true)
  const showChangeCodeDialog = () => setIsChangeCodeDialogOpen(true)
  const handleShowAddCoinsModal = () => setIsAddCoinsDialogOpen(true)

  const editUserDetails = {
    username,
    email,
    fanSince,
    squadNumber,
    teamId: teams?.ID 
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-full ">

<div className="flex items-center justify-between mb-8">
  <div className="flex items-center gap-4">
    <Button
      variant="ghost"
      onClick={() => navigate('/users')}
      className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Users List
    </Button>
  </div>

  <div className="flex items-center gap-3"> 
    <Button
      variant="default"
      onClick={showEditModal} 
      className="shadow-sm" 
    >
      <Pencil className="mr-2 h-4 w-4" />
      Edit User
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="shadow-sm">
          <Edit className="mr-2 h-4 w-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuGroup>
          {/* "Edit User Details" is now a separate button, so remove it from here */}
          <DropdownMenuItem onClick={handleShowAddCoinsModal}>
            <Coins className="mr-2 h-4 w-4 text-gray-500" />
            Add Coins
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={showDeactivateCodeDialog}>
          <QrCode className="mr-2 h-4 w-4 text-gray-500" /> Deactivate Invite Code
        </DropdownMenuItem>
        <DropdownMenuItem onClick={showActivateCodeDialog}>
          <QrCode className="mr-2 h-4 w-4" /> Activate Invite Code
        </DropdownMenuItem>
        <DropdownMenuItem onClick={showChangeCodeDialog}>
          <QrCode className="mr-2 h-4 w-4 text-gray-500" /> Change Invite Code
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={showDeleteDialog} className="text-red-600 focus:bg-red-50 focus:text-red-700">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>

        <div className=" flex flex-col gap-8">
        <Card className="shadow-lg rounded-xl overflow-hidden border border-gray-200"> 
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 bg-white border-b border-gray-100"> 
      <CardTitle className="text-2xl font-bold flex items-center gap-3 text-gray-800"> 
        <User className="h-6 w-6 text-primary-600" /> 
        @{username}
      </CardTitle>
      {teams?.name && (
        <div className="flex items-center gap-2 text-md font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-200"> 
          <span
            className="h-3 w-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: teams.color  }} 
          ></span>
          <span>{teams.name}</span>
        </div>
      )}
    </CardHeader>
    <CardContent className="p-6 "> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-6"> 

        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Full Name</Label>
          <p className="mt-1 text-gray-900 text-lg font-semibold">{name || 'N/A'}</p> 
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Username</Label>
          <p className="mt-1 text-gray-900 text-lg font-semibold">@{username || 'N/A'}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Email Address</Label>
          <p className="mt-1 text-gray-900 text-lg font-semibold">{email || 'N/A'}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Squad Number</Label>
          <p className="mt-1 text-gray-900 text-lg font-semibold">#{squadNumber || 'N/A'}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Coin Balance</Label>
          <p className="mt-1 text-gray-900 text-lg font-semibold">{wallet?.balance || 0} coins</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">User's Invite Code</Label>
          <p className="mt-1 font-mono text-gray-900 text-lg font-semibold">{inviteCode || 'N/A'}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Referrer Code Used</Label>
          <p className="mt-1 font-mono text-gray-900 text-lg font-semibold">{referrerCode || 'None'}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Email Verification</Label>
          <p className="text-sm text-gray-600"> {getVerificationBadge(emailVerified, "Email")}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Fan Since</Label>
          <p className="mt-1 text-gray-900 text-lg font-semibold">{fanSince || 'N/A'}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Account Created</Label>
          <p className="mt-1 text-gray-900 text-lg font-semibold">{createdAt ? formatClearDate(new Date(createdAt)) : 'N/A'}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
          <p className="mt-1 text-gray-900 text-lg font-semibold">{updatedAt ? formatClearDate(new Date(updatedAt)) : 'N/A'}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Team</Label>
          <p className="mt-1 font-medium text-gray-900 text-lg">{teams?.name || 'N/A'}</p>
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-500">Invite Code Status</Label>
          <p className="mt-1 text-gray-900 text-lg font-semibold">{inviteDeactivated ? 'Deactivated' : 'Active'}</p>
        </div>
      </div>
    </CardContent>
  </Card>

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