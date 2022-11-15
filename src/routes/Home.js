import React, {useEffect, useState} from "react";
import {dbService, storageService} from "Fbase";
import { addDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import {ref, uploadString, getDownloadURL } from "@firebase/storage";
import {Zweet} from "components/Zweet";
import { v4 as uuidv4 } from 'uuid';

export const Home = ({ userObj })=> {
    const [zweet, setZweet] = useState("");
    const [zweets, setZweets] = useState([]);
    const [attachment, setAttachment] = useState("");
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
        let attachmentUrl = "";
        try{
            if(attachment !== "") {
                const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
                const response = await uploadString(attachmentRef, attachment, "data_url");
                attachmentUrl = await getDownloadURL(response.ref);
            }
            const zweetObj = {
                text: zweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
                attachmentUrl
            };
            await addDoc(collection(dbService, "zweets"),zweetObj);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        setZweet("");
        setAttachment("");
    };
    const onChange = ({ target: {value} })=> {
        setZweet(value);
    }
    const onFileChange = ({target:{files}}) => {
        const theFile = files[0]; //파일을 가져오고
        const reader = new FileReader(); //reader를 만든 후
        reader.onloadend = ({currentTarget:{result}}) => {
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);  //readAsDataURL을 사용해서 파일을 읽는다.
    }
    const onClearAttachment = ()=> setAttachment("");
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
                    <input type="file" accept="image/*" onChange={onFileChange}/>
                    <input type="submit" value="zweet"/>
                    { attachment && (
                        <div>
                            <img alt="uploadImage" src={attachment} width="50px" height="50px"/>
                            <button onClick={onClearAttachment}>Clear</button>
                        </div>
                    ) }
                </form>
                <div>
                    {zweets.map(zweet => (
                        <Zweet key={zweet.id} zweetObj={zweet} isOwner={zweet.creatorId === userObj.uid }/>
                    ))}
                </div>
            </div>
        );
};