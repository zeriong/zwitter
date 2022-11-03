import React, {useState} from "react";
import {
    BrowserRouter as Router, Route, Routes,
} from "react-router-dom";
import {Auth} from "../routes/Auth";
import {Home} from "../routes/Home";

export const AppRouter = ( {isLoggedIn} )=> {
    return (
        <Router>
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route path="/" element={<Home/>}/>
                    </>
                ): (
                    <Route path="/" element={<Auth/>}/>
                )}
            </Routes>
        </Router>
    );
};