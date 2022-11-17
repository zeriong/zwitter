import React, {useEffect, useState} from "react";
import {authService, dbService} from "Fbase";
import { useNavigate } from "react-router-dom";
import {collection, getDocs, query, where} from "@firebase/firestore";
import {updateProfile} from "@firebase/auth";

export const Profile = ( { refreshUser, userObj } )=> {
    /* 굳이 userObj를 전달받아서 여기저기서 쓰는 이유는 소스를 하나로 통합해주기 위함이다.
    authService.currentUser.uid로도 가져올 수 있지만 userObj는 하나만 변경해줘도 모두 바뀌기 때문에 더 편리하다. */

    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
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
    const onChange = ( {target: {value} }) => {
        setNewDisplayName(value);
    }
    const onSubmit = async (e)=> {
        e.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(authService.currentUser,{displayName: newDisplayName});
        }
        refreshUser();
    }
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    onChange={onChange}
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                    autoFocus
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    )
};