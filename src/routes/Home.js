import React, {useEffect, useState} from "react";
import { dbService } from "Fbase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export const Home = ()=> {
    const [zweet, setZweet] = useState("");
    const [zweets, setZweets] = useState([]);
    const getZweets = async () => {
        const dbZweets = await getDocs(collection(dbService,"zweets"));
        dbZweets.forEach((document) => {
            const zweetObject = {
                ...document.data(),
                id: document.id,
            }
            setZweets((prev)=>[zweetObject, ...prev])
        });
        console.log(dbZweets);
    }
    useEffect(()=>{
        getZweets();
    },[]);
    const onSubmit = async (event)=> {
        event.preventDefault();
        try{
            const docRef = await addDoc(collection(dbService, "zweets"),{
                zweet,
                createAt: Date.now(),
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
                        <div key={zweet.id}>
                            <h4>{zweet.zweet}</h4>
                        </div>
                    ))}
                </div>
            </div>
        );
};