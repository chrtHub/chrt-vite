import { IAccountContext } from "../../../../Context/AccountContext";

export function isRoleActive(
  roleName: string,
  AccountContext: IAccountContext
): boolean {
  return Boolean(
    AccountContext.roles.find((role) => role.role_name === roleName)
  );
}
