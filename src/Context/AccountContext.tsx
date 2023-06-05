//-- react --//
import { useState, createContext, useContext, PropsWithChildren } from "react";

//-- types --//
import { RoleWithPermissions } from "../Auth/Auth0";

//-- Create interface and Context --//
export interface IAccountContext {
  rolesWithPermissionsList: RoleWithPermissions[];
  setRolesWithPermissionsList: React.Dispatch<
    React.SetStateAction<RoleWithPermissions[]>
  >;
}

//-- Create context --//
const AccountContext = createContext<IAccountContext | undefined>(undefined);

//-- Custom Provider Component --//
function AccountContextProvider({ children }: PropsWithChildren) {
  //-- Enumerate current model options --//

  //-- State values --//
  const [rolesWithPermissionsList, setRolesWithPermissionsList] = useState<
    RoleWithPermissions[]
  >([]);

  //-- Bundle values into accountContextValue --//
  const accountContextValue: IAccountContext = {
    rolesWithPermissionsList,
    setRolesWithPermissionsList,
  };

  //-- Return context provider --//
  return (
    <AccountContext.Provider value={accountContextValue}>
      {children}
    </AccountContext.Provider>
  );
}

//-- Custom Consumer Hook --//
function useAccountContext() {
  const context = useContext(AccountContext);

  if (context === undefined) {
    throw new Error(
      "useAccountContext must be used within a AccountContextProvider"
    );
  }
  return context;
}

//-- Export Provider Component and Consumer Hook ---//
export { AccountContextProvider, useAccountContext };

//-- TO BE SET UP IN THE COMPONENT TREE ABOVE ALL CONSUMERS OF THIS CONTEXT --//

//-- FOR REPEATED USE IN OTHER COMPONENTS --//
// import { useAccountContext } from "../../Context/AccountContext";
// let AccountContext = useAccountContext();
