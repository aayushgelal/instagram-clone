import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import './ImageUpload.css';
import { db, storage } from './Firebase.js';
import firebase from 'firebase';
function ImageUpload({ username }) {
    const [Caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    function handleCaption(event) {
        setCaption(event.target.value);
    }
    function handleClick() {
        const uploadtask = storage.ref(`images/${image.name}`).put(image);
        uploadtask.on('state_changed', (snapshot) => {
            setProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100));

        }, error => {
            alert(error.message)
        }, () => {
            storage.ref('images').child(image.name).getDownloadURL().then(url => db.collection('posts').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: Caption,
                username: username,
                imageURL: url
            }))
            setProgress(0);
            setCaption('');
            setImage(null);
        }
        )

    }
    function handleChange(event) {
        if (event.target.files[0]) {
            setImage(event.target.files[0]);
        }

    }
    return (
        <div className="imageform">
            <progress value={progress} className="progress_bar" max='100' />
            <input type='text' value={Caption} placeholder="Enter a caption" onChange={handleCaption} />
            <label for='file-upload'>Pick a photo</label><input id='file-upload' type='file' onChange={handleChange} />
            <Button onClick={handleClick}>Post</Button>
        </div>
    )
}

export default ImageUpload
