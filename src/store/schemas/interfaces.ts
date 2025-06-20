export interface CoinTransaction {
    id: string
    userId: string
    type: 'earned' | 'spent' | 'bonus' | 'refund'
    amount: number
    description: string
    reference?: string 
    status: 'completed' | 'pending' | 'failed'
    createdAt: Date
    updatedAt: Date
  }
  
  export interface InviteUsage {
    id: string
    inviteCode: string
    invitedBy: string 
    invitedByName: string
    usedBy: string
    usedByName: string
    usedByEmail: string
    rewardGiven: number
    status: 'active' | 'inactive' | 'banned'
    usedAt: Date
    createdAt: Date
  }