//-- react, react-router-dom, Auth0 --//
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

//-- JSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
const Profile = () => {
  const [userMetadata, setUserMetadata] = useState(null);

  const { isLoading, isAuthenticated, user, getAccessTokenSilently } =
    useAuth0();

  useEffect(() => {
    const getUserMetadata = async () => {
      const auth0_mgmt_api_domain = "dev-u4trvdw25pkfbgaq.us.auth0.com";

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${auth0_mgmt_api_domain}/api/v2/`,
            scope: "read:current_user",
          },
        });

        const metadataResponse = await fetch(
          `https://${auth0_mgmt_api_domain}/api/v2/users/${user.sub}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const { user_metadata } = await metadataResponse.json();
        console.log("user_metadata: " + user_metadata); // DEV
        setUserMetadata(user_metadata);
      } catch (err) {
        console.log("error: " + err.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <h2>user.name: {user.name}</h2>
        <p>user.email: {user.email}</p>
        <img src={user.picture} alt={user.name} />
        <h3>User Metadata</h3>
        {userMetadata ? (
          <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
        ) : (
          "No user metadata defined"
        )}
      </div>
    )
  );
};

export default Profile;
