import React,{useState,useEffect} from 'react';
import { Avatar } from '@material-ui/core';
import './Post.css';
import {db} from './Firebase';
import firebase from 'firebase';
function Post(props) {
    const [comments,setcomments]=useState([]);
    const [comment,setcomment]=useState('');
    useEffect(() => {
        if(props.postId){
db.collection('posts')
.doc(props.postId)
.collection('comments')
.orderBy('timestamp','desc')
.onSnapshot(snapshot => setcomments(snapshot.docs.map(doc => doc.data())))
        }
    },[props.postId])
   
    function handleComment(event){
        event.preventDefault();
        db.collection('posts').doc(props.postId).collection('comments').add({text:comment,username:props.signedUser,timestamp:firebase.firestore.FieldValue.serverTimestamp()});
        setcomment('');
    }
    return (
        <div className="post">
            <div className="post_header"> <Avatar className="avatar">anything</Avatar><h4>{props.username}</h4></div>
            <img src={props.imageUrl} alt="react" />
            <h4 className="caption"><strong>{props.username}</strong> {props.caption} </h4>
    <div className='comments'>Comments {comments.map((c,index) => (
        <div className='comment' key={index}>
            <h6>{c.username}</h6>
    {c.text}
            </div>
    ))}</div>
    {props.signedUser&&
            <form>
                <div class="add comment">
                <input style={{flex:1}} type='text' placeholder='Comment' value={comment} onChange={(event) => setcomment(event.target.value)} />
                <button type='submit' onClick={handleComment}>Post</button>
                </div>

            </form>
}

        </div>
    )
}

export default Post