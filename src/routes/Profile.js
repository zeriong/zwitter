import React from "react";
import {authService} from "Fbase";
import { useNavigate } from "react-router-dom";

export const Profile = ()=> {
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/",{replace:true});
    };
    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
};