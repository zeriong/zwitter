import React from "react";


export const Zweet = ({ zweetObj, isOwner })=> (
        <>
            <div>
                <h4>{zweetObj.text}</h4>
                {isOwner && (
                    <>
                        <button>Delete Zweet</button>
                        <button>Edit Zweet</button>
                    </>
                )}
            </div>
        </>
);