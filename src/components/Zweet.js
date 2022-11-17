import React, { useState } from "react";
import { dbService, storageService } from "Fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


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
        <div className="nweet">
            {
                editing ? (
                    <>
                        <form onSubmit={onSubmit} className="container nweetEdit">
                            <input type="text"
                                   placeholder="Edit your zweet"
                                   value={newZweet}
                                   required
                                   autoFocus
                                   onChange={onChange}
                                   className="formInput"
                            />
                            <input
                                type="submit"
                                value="Update Zweet"
                                className="formBtn"
                            />
                        </form>
                        <span onClick={toggleEditing} className="formBtn cancelBtn">
                            Cancel
                        </span>
                    </>
                ) : (
                    <>
                        <div>
                            <h4>{zweetObj.text}</h4>
                            {zweetObj.attachmentUrl && <img alt="up-img" src={zweetObj.attachmentUrl} />}
                            {isOwner && (
                                <div className="nweet__actions">
                                    <span onClick={onDeleteClick}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                    <span onClick={toggleEditing}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </span>
                                </div>
                            )}
                        </div>
                    </>
                )
            }
        </div>
    );
};