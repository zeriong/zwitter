import React, {useEffect, useState} from "react";
import { dbService } from "Fbase";
import { addDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {Zweet} from "components/Zweet";

export const Home = ({ userObj })=> {
    const [zweet, setZweet] = useState("");
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
    const onSubmit = async (event)=> {
        event.preventDefault();
        try{
            const docRef = await addDoc(collection(dbService, "zweets"),{
                text: zweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
            });
            console.log("Document written with ID: ",docRef);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        setZweet("");
    };
    const onChange = ({ target: {value} })=> {
        setZweet(value);
    }
    console.log(zweets);
        return (
            <div>
                <form onSubmit={onSubmit}>
                    <input
                        value={zweet}
                        onChange={onChange}
                        type="text"
                        placeholder="What's on your mind?"
                        maxLength={120}
                    />
                    <input type="submit" value="zweet"/>
                </form>
                <div>
                    {zweets.map(zweet => (
                        <Zweet key={zweet.id} zweetObj={zweet} isOwner={zweet.creatorId === userObj.uid }/>
                    ))}
                </div>
            </div>
        );
};