import React, { useEffect } from "react";
import {authService, dbService} from "Fbase";
import { useNavigate } from "react-router-dom";
import {collection, getDocs, query, where, orderBy} from "@firebase/firestore";

export const Profile = ({userObj})=> {
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/",{replace:true});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getMyZweets = async ()=> {
        try {
            const q = query(
                collection(dbService,"zweets"),
                where("creatorId", "==", userObj.uid),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc)=>{
                console.log(doc.id,"=>",doc.data());
            });
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(()=> {
        getMyZweets();
    },[getMyZweets])
    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
};