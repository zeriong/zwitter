import {
    BrowserRouter as Router, Route, Routes,
} from "react-router-dom";
import {Auth} from "routes/Auth";
import {Home} from "routes/Home";
import {Profile} from "routes/Profile";
import {Navigation} from "components/Navigation";

export const AppRouter = ( {refreshUser, isLoggedIn, userObj} )=> {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <Routes>
                {isLoggedIn ? (
                    <Route
                        style={{
                            maxWidth: 890,
                            width: "100%",
                            margin: "0 auto",
                            marginTop: 80,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Route path={`${process.env.PUBLIC_URL}/`} element={<Home userObj={userObj}/>}/>
                        <Route path={`${process.env.PUBLIC_URL}/profile`}
                               element={ <Profile userObj={userObj}
                                refreshUser={refreshUser} /> }
                        />
                    </Route>
                ): (
                    <>
                        <Route path="/" element={<Auth/>}/>
                    </>
                )}
            </Routes>
        </Router>
    );
};