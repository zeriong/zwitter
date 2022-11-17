import React, {useEffect, useState} from "react";
import {dbService} from "Fbase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {Zweet} from "components/Zweet";
import {ZweetFactory} from "components/ZweetFactory";

export const Home = ({ userObj })=> {
    const [zweets, setZweets] = useState([]);
    useEffect(()=>{
        const q = query(
            collection(dbService, "zweets"),
            orderBy("createdAt","desc")
            //백엔드에서도 문서 추가할때 필드 "createdAt"가 없다면 업데이트가 안된다. 고로 백엔드에서 보내는 기능을 쓰고 싶다면 orderBy를 삭제하거나 다른걸 찾아보자.
        );
        onSnapshot(q, (snapshot)=>{
            const zweetArr = snapshot.docs.map((doc)=>({
                id: doc.id,
            ...doc.data(),
            }));
            setZweets(zweetArr);
        });
    },[]);

        return (
            <div className="container">
                <ZweetFactory userObj={userObj}/>
                <div style={{ marginTop: 30 }}>
                    {zweets.map(zweet => (
                        <Zweet key={zweet.id} zweetObj={zweet} isOwner={zweet.creatorId === userObj.uid }/>
                    ))}
                </div>
            </div>
        );
};