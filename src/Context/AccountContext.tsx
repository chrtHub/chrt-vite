//-- react --//
import { useState, createContext, useContext, PropsWithChildren } from "react";

//-- types --//
import { RoleWithPermissions } from "../Auth/Auth0";

//-- Create interface and Context --//
export interface IAccountContext {
  roles: RoleWithPermissions[];
  setRoles: React.Dispatch<React.SetStateAction<RoleWithPermissions[]>>;
  rolesFetched: boolean;
  setRolesFetched: React.Dispatch<React.SetStateAction<boolean>>;
  addingFreePreviewAccess: boolean;
  setAddingFreePreviewAccess: React.Dispatch<React.SetStateAction<boolean>>;
  removingFreePreviewAccess: boolean;
  setRemovingFreePreviewAccess: React.Dispatch<React.SetStateAction<boolean>>;
}

//-- Create context --//
const AccountContext = createContext<IAccountContext | undefined>(undefined);

//-- Custom Provider Component --//
function AccountContextProvider({ children }: PropsWithChildren) {
  //-- State values for context --//
  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [rolesFetched, setRolesFetched] = useState<boolean>(false);
  const [addingFreePreviewAccess, setAddingFreePreviewAccess] =
    useState<boolean>(false);
  const [removingFreePreviewAccess, setRemovingFreePreviewAccess] =
    useState<boolean>(false);

  //-- Bundle values into accountContextValue --//
  const accountContextValue: IAccountContext = {
    roles,
    setRoles,
    rolesFetched,
    setRolesFetched,
    addingFreePreviewAccess,
    setAddingFreePreviewAccess,
    removingFreePreviewAccess,
    setRemovingFreePreviewAccess,
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

//-- FOR REPEATED USE IN OTHER COMPONENTS --//
// import { useAccountContext } from "../../Context/AccountContext";
// let AccountContext = useAccountContext();
