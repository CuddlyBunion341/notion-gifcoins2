export type ApiTransaction = {
  id: number
  message: string
  amount: number
  created_at: string
  spender: {
    id: number
    name: string
  }
  recipient: {
    id: number
    name: string
  }
}

