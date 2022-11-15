import React, { useState } from "react";
import { dbService, storageService } from "Fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";


export const Zweet = ({ zweetObj, isOwner })=> {
    const [editing, setEditing] = useState(false);
    const [newZweet, setNewZweet] = useState(zweetObj.text);
    const zweetTextRef = doc(dbService, "zweets", `${zweetObj.id}`);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this zweet?");
        if(ok){
            await deleteDoc(zweetTextRef);
            await deleteObject(ref(storageService, zweetObj.attachmentUrl));
        }
    };
    const toggleEditing = () => setEditing((prev)=> !prev);
    const onChange = ({target:{value}})=> setNewZweet(value);
    const onSubmit = async (e) => {
        e.preventDefault();
        await updateDoc(zweetTextRef,{
            text: newZweet,
        });
        setEditing(false);
    };
    return (
        <div>
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input type="text"
                                   placeholder="Edit your zweet"
                                   value={newZweet}
                                   required
                                   onChange={onChange}
                            />
                            <input
                                type="submit"
                                value="Update Zweet"
                            />
                        </form>
                        <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                    <>
                        <div>
                            <h4>{zweetObj.text}</h4>
                            {zweetObj.attachmentUrl && <img alt="uploadImage" src={zweetObj.attachmentUrl} width="50px" height="50px"/>}
                            {isOwner && (
                                <>
                                    <button onClick={onDeleteClick}>Delete Zweet</button>
                                    <button onClick={toggleEditing}>Edit Zweet</button>
                                </>
                            )}
                        </div>
                    </>
                )
            }
        </div>
    );
};