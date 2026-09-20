import { createContext, ReactNode, useState } from "react";
import type { UserContextType } from "../types/User";

export const UserContext = createContext<UserContextType>({
  userLog: null,
  setUserlog: () => {

  }
});

export const UserProvider = ({children} : {children: ReactNode}) => {
const [userLog, setUserlog] = useState(null);

  return <UserContext.Provider value={{userLog, setUserlog}}>{children}</UserContext.Provider>
}