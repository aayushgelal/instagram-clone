import './App.css';
import Header from './header';
import Post from './Post';
import React, { useEffect, useState } from 'react';
import { db, auth } from "./Firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from '@material-ui/core/styles';
import { Input, Button } from '@material-ui/core';
import ImageUpload from './ImageUpload';

function App() {

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      textAlign: 'center',
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const modalStyle = getModalStyle();

  const [posts, setpost] = useState([]);
  const [open, setopen] = useState(false);
  const [openSignin, setopensignin] = useState(false);
  const [info, setinfo] = useState({ username: '', password: '', email: '' });
  const [user, setUser] = useState(null);
  useEffect(() => {
    db.collection("posts").onSnapshot(snapshot => setpost(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
    })
    )));
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);

      } else {
        setUser(null);
      }
    })
    return () => unsubscribe()
  }, [user, info.username])
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setinfo({ ...info, [name]: value });
  }
  function pressed(event) {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(info.email, info.password).then(authUser => authUser.user.updateProfile({ displayName: info.username })).catch(err => alert(err));
    setopen(false);
  }
  function pressedSignin(event) {
    event.preventDefault();
    auth.signInWithEmailAndPassword(info.email, info.password).catch(err => alert(err));
    setopensignin(false);
  }

  return (
    <div className="app">
      <Modal open={open} onClose={() => setopen(false)}>
        <div className={classes.paper} style={modalStyle}  >
          <img className="name" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="instagram" />
          <form className="signup_form" onSubmit={pressed}>
            <Input name='username' placeholder="username" value={info.username} onChange={handleChange} />
            <Input name='email' placeholder="eail" value={info.email} onChange={handleChange} />
            <Input name='password' placeholder="password" value={info.password} onChange={handleChange} />
            <Button type='submit' >SignUp</Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignin} onClose={() => setopensignin(false)}>
        <div className={classes.paper} style={modalStyle}  >
          <img className="name" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="instagram" />
          <form className="signup_form" onSubmit={pressedSignin}>
            <Input name='email' placeholder="eail" value={info.email} onChange={handleChange} />
            <Input name='password' placeholder="password" value={info.password} onChange={handleChange} />
            <Button type='submit' >SignUp</Button>
          </form>
        </div>
      </Modal>
      <div className="Header">      <Header />       {user ? <Button onClick={() => auth.signOut()}>Log Out</Button> : <div className="login_container"><Button onClick={() => setopensignin(true)}>Log In</Button><Button onClick={() => setopen(true)}>Signin</Button></div>}

      </div>
      <div className="Post">      {posts.map(({ post, id }) => <Post key={id} signedUser={user?user.displayName:null} postId={id} imageUrl={post.imageURL} username={post.username} caption={post.caption} />)}

      </div>

      {user?
        <ImageUpload username={user.displayName} />
        : <h4>You need to login to upload</h4>
      }
    </div>
  );
}

export default App;
