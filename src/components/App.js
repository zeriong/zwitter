import React, {useEffect, useState} from "react";
import { AppRouter } from "components/Router";
import { authService } from "Fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsloggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      if (user) {
        setIsloggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: { displayName: user.displayName },
        });
      } else {
        setIsloggedIn(false);
      }
      setInit(true);
    });
      },[]);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: { displayName: user.displayName },
    });
  }
  return (
      <>
        { init ? (
            <AppRouter
                isLoggedIn={isLoggedIn}
                userObj={userObj}
                refreshUser={refreshUser}
            />
        ) : (
            "Initializing...."
        ) }
      </>
  );
}

export default App;
