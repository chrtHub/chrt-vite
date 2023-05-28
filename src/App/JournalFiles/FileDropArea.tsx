//== react, react-router-dom, recoil, Auth0, react-error-boundary ==//
import { useEffect, useCallback, ChangeEvent } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//== TSX Components, Functions ==//
import { getPermissions } from "../../Auth/getPermissions";
import { throwAxiosError } from "../../Errors/throwAxiosError";

//== NPM Components ==//
import { FileWithPath, useDropzone } from "react-dropzone";

//== Icons ==//
import { FolderIcon } from "@heroicons/react/24/outline";

//== NPM Functions ==//
import { useErrorBoundary } from "react-error-boundary";

//== Utility Functions ==//
import classNames from "../../Util/classNames";

//== Environment Variables, TypeScript Interfaces, Data Objects ==//

//== ***** ***** ***** Exported Component ***** ***** ***** ==//
interface IProps {
  setPutFilename: React.Dispatch<React.SetStateAction<string | null>>;
  setPutFileData: React.Dispatch<React.SetStateAction<Blob | null>>;
}
export default function FileDropArea({
  setPutFilename,
  setPutFileData,
}: IProps) {
  //== React State, Custom Hooks ==//
  const { getAccessTokenSilently } = useAuth0();
  const { showBoundary } = useErrorBoundary();

  //== Auth ==//

  //== Other ==//
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setPutFileData(acceptedFiles[0]);
      setPutFilename(acceptedFiles[0].name);
    },
    [setPutFileData, setPutFilename] //-- State setters shouldn't ever change, but including anyways --//
  );
  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "text/csv": [".csv"],
      },
      maxFiles: 1,
      maxSize: 10485760, //-- 10 MB --//
      onDrop: onDrop,
    });

  //== Side Effects ==//
  //-- On mount, check if accessToken permissions include "write:journal" --//
  const lambda = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const permissions = await getPermissions(accessToken);
      if (!permissions.includes("write:journal")) {
        throwAxiosError(401);
      }
    } catch (err) {
      showBoundary(err);
    }
  };
  useEffect(() => {
    lambda();
  }, []);

  //== Event Handlers ==//
  const fileUploadHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    let file = event.target.files[0];
    //-- Check file size --//
    if (file?.size < 10 * 1024 * 1024) {
      alert("File size limit is 10 MB");
    } else {
      setPutFileData(file);
      setPutFilename(file?.name);
    }
  };

  //== ***** ***** ***** Component Return ***** ***** ***** ==//
  return (
    <form className="mt-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <div
            {...getRootProps()}
            className={classNames(
              isDragAccept ? "bg-green-200" : "",
              isDragReject ? "bg-orange-200" : "",
              "flex cursor-pointer justify-center rounded-md border-2 border-dashed border-zinc-300 px-6 pb-6 pt-5 hover:bg-green-100 dark:hover:bg-green-900"
            )}
          >
            <input {...getInputProps()} />
            <div className="space-y-1 text-center">
              <FolderIcon className="mx-auto h-10 w-10 text-zinc-400" />
              <div className="flex text-sm text-zinc-600">
                <label
                  htmlFor="file-upload"
                  className="hover-within:outline-none hover-within:ring-2 hover-within:ring-green-500 hover-within:ring-offset-2 relative cursor-pointer rounded-md bg-green-100 px-1 font-medium text-green-600 dark:bg-green-900 dark:text-white"
                >
                  <span>Select a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv"
                    onChange={fileUploadHandler}
                  />
                </label>
                <p className="pl-1 dark:text-zinc-100">or drag and drop</p>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-200">
                CSV files up to 10MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
