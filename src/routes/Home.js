import React, { useState } from "react";
import { dbService,dbAddDoc,dbCollection } from "Fbase";

export const Home = ()=> {
    const [zweet, setZweet] = useState("");
    const onSubmit = async (event)=> {
        event.preventDefault();
        try{
            const docRef = await dbAddDoc(dbCollection(dbService, "zweets"),{
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
            </div>
        );
};