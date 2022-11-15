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
        setUserObj(user);
      } else {
        setIsloggedIn(false);
      }
      setInit(true);
    });
      },[]);
  return (
      <>
        { init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing...." }
      </>
  );
}

export default App;
