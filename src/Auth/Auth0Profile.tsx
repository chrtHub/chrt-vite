//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
const Profile = () => {
  const [accessToken, setAccessToken] = useState<string>("");

  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      let res = await getAccessTokenSilently();
      setAccessToken(res);
    };
    fetchToken();
  }, [user]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <img
        src={user?.picture}
        alt={user?.name}
        className="mb-4 h-40 w-40 rounded-full"
      />
      <h2 className="text-2xl font-medium">{user?.name}</h2>
      <p className="text-gray-500">{user?.email}</p>
      <div className="mt-8 text-lg">
        Current Auth Token:{" "}
        <div className="w-full overflow-auto break-all font-mono">
          {accessToken ? accessToken : "loading"}
        </div>
      </div>
    </div>
  );
};

export default Profile;
