//-- react, react-router-dom, Auth0 --//
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//

//-- Utility Functions --//

//-- Data Objects --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
const Profile = () => {
  const { user } = useAuth0();

  return (
    <div>
      <h2>user.name: {user.name}</h2>
      <p>user.email: {user.email}</p>
      <img src={user.picture} alt={user.name} />
    </div>
  );
};

export default Profile;
