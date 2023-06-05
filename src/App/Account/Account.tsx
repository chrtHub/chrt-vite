//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

//-- TSX Components and Functions --//
import { useAccountContext } from "../../Context/AccountContext";
import { axiosErrorToaster } from "../../Errors/axiosErrorToaster";

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

//-- Utility Functions --//

//-- Data Objects, Types --//
import { RoleWithPermissions } from "../../Auth/Auth0";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import classNames from "../../Util/classNames";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function Account() {
  //-- State, Context, Custom Hooks --//

  let AccountContext = useAccountContext();
  const { getAccessTokenSilently, user } = useAuth0();
  const { showBoundary } = useErrorBoundary();

  //-- Other --//

  //-- Side Effects --//
  useEffect(() => {
    getUsersPermissions();
  }, []);

  const getUsersPermissions = async () => {
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make GET request --//
      let res = await axios.get(
        `${VITE_ALB_BASE_URL}/auth0/api/v2/get_user_roles_with_permissions`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data: RoleWithPermissions[] = res.data;
      AccountContext.setRolesWithPermissionsList(data);
      //----//
    } catch (err) {
      // console.log(err) // DEV
      // showBoundary(err) // DEV
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "Get roles and permissions");
      }
    }
  };

  //-- Handlers --//
  const addFreePreviewAccessHandler = async () => {
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make POST request --//
      await axios.post(
        `${VITE_ALB_BASE_URL}/auth0/api/v2/assign_roles_to_user/free_preview_access`,
        //-- Body Content --//
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //----//
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "");
      } else if (err instanceof Error) {
        toast(err.message);
      }
    }
    //-- Update listed permissions --//
    getUsersPermissions();
  };

  const removeFreePreviewAccesshandler = async () => {
    console.log("todo - remove free preview access"); // DEV
    try {
      //-- Get access token from memory or request new token --//
      let accessToken = await getAccessTokenSilently();

      //-- Make POST request --//
      let res = await axios.delete(
        `${VITE_ALB_BASE_URL}/auth0/api/v2/remove_roles_from_user/free_preview_access`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      //----//
    } catch (err) {
      if (err instanceof AxiosError) {
        axiosErrorToaster(err, "");
      } else if (err instanceof Error) {
        toast(err.message);
      }
    }

    //-- Update listed permissions --//
    getUsersPermissions();
  };

  //-- Check if using email + password sign in or google account oauth2 sync --//
  let oauth2: boolean = false;
  let oauth2Provider: string = "";
  if (user?.sub?.startsWith("google-oauth2")) {
    oauth2 = true;
    oauth2Provider = "Google";
  }

  return (
    <div className="divide-y divide-white/5 px-2 py-2">
      {/*-- Personal Information Section --*/}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-white">Identity</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Basic information about you
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="mb-4 grid grid-cols-1">
            <div className="col-span-full flex items-center gap-x-8">
              <img
                src={user?.picture}
                alt={user?.name}
                className="h-24 w-24 flex-none rounded-lg bg-zinc-800 object-cover"
              />
              <div>
                <h2 className="mb-2 text-2xl font-semibold text-white">
                  {user?.name}
                </h2>
                <h2 className="mb-2 text-sm text-zinc-200">{user?.email}</h2>
                <p className="text-xs text-zinc-400">
                  {oauth2 && <p>Synced from your {oauth2Provider} account</p>}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*-- Subscription --*/}
      <div className="mb-4 grid grid-cols-1 pt-5 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-white">Subscription</h2>
          <p className="mt-2 text-sm text-zinc-400">
            View, add, or remove access to chrt features
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="mb-4 grid grid-cols-1 gap-4">
            <div className="flex items-center gap-8">
              <div className="">
                {AccountContext.rolesWithPermissionsList.map((role, idx) => (
                  <div key={idx} className="mb-5">
                    <h2 className="text-md text-zinc-300">
                      Role: {role.role_name}
                    </h2>
                    <p className="text-zinc-500">
                      Description: {role.role_description}
                    </p>
                    <h3 className="text-zinc-300">Permissions:</h3>
                    <ul className="list-disc pl-5 text-zinc-500">
                      {role.permissions.map((permission, jdx) => (
                        <li key={jdx}>{permission}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={addFreePreviewAccessHandler}
              className={classNames(
                "inline-flex w-64 items-center gap-x-2 rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
              )}
            >
              <PlusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Add Free Preview Access
            </button>
            <button
              type="button"
              onClick={removeFreePreviewAccesshandler}
              className={classNames(
                "inline-flex w-64 items-center gap-x-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              )}
            >
              <MinusCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Remove Free Preview Access
            </button>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-white">
            Subscription
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            View, add, or remove access to chrt features
          </p>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-white">
            Change password
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            Update your password associated with your account.
          </p>
        </div>

        <form className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="current-password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Current password
              </label>
              <div className="mt-2">
                <input
                  id="current-password"
                  name="current_password"
                  type="password"
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium leading-6 text-white"
              >
                New password
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  name="new_password"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              className="rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Delete Account Section */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-white">
            Delete account
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">
            No longer want to use our service? You can delete your account here.
            This action is not reversible. All information related to this
            account will be deleted permanently.
          </p>
        </div>

        <form className="flex items-start md:col-span-2">
          <button
            type="submit"
            className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
          >
            Yes, delete my account
          </button>
        </form>
      </div>
    </div>
  );
}
