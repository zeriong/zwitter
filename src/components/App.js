import React, {useEffect, useState} from "react";
import { AppRouter } from "components/Router";
import { authService } from "Fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsloggedIn] = useState(false);
  useEffect(()=>{
    authService.onAuthStateChanged((user)=>{
      if (user) {
        setIsloggedIn(true);
      } else {
        setIsloggedIn(false);
      }
      setInit(true);
    });
      },[]);
  return (
      <>
        { init ? <AppRouter isLoggedIn={isLoggedIn}/> : "Initializing...." }
      </>
  );
}

export default App;
