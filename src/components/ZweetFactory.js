import React from "react";
import {getDownloadURL, ref, uploadString} from "firebase/storage";
import {dbService, storageService} from "Fbase";
import {v4 as uuidv4} from "uuid";
import {addDoc, collection} from "firebase/firestore";
import {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

export const ZweetFactory = ({userObj})=> {
    const [zweet, setZweet] = useState("");
    const [attachment, setAttachment] = useState("");
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
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={zweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        alt="attachment"
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    )
}