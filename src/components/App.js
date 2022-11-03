import React,{ useState } from "react";
import { AppRouter } from "components/Router";
import { authService } from "Fbase";

function App() {
  const [isLoggedIn, setIsloggedIn] = useState(authService.currentUser);
  return (
      <AppRouter isLoggedIn={isLoggedIn}/>
  );
}

export default App;
