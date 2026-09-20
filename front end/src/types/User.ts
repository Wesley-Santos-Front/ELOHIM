export interface UserInterface {
usuario: String
}

export type UserContextType = {
  userLog: UserInterface | null,
  setUserlog: React.Dispatch<React.SetStateAction<null>>
}