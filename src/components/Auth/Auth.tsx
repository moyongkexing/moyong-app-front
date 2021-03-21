import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import axios from 'axios'
import { auth, provider, storage } from "../../firebase";
import { updateUserProfile, setShowUser } from "../../features/userSlice";
import styles from "./Auth.module.scss";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  makeStyles,
  Modal,
  IconButton,
  Box,
} from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}
const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: "10",
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10)
  }
}));
const Auth:React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  
  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      })
  };
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  }
  const testLogin = async () => {
    await auth.signInWithEmailAndPassword("otameshi@gmail.com", "password");
  }
  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };
  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };
  const signUpEmailWithFirebase = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);
    let url = "";
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;
      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }
    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });
    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    )
    dispatch(
      setShowUser({
        name: username,
        avatar: url,
      })
    )
  };
  // const signUpEmailWithRails = async () => {
  //   let url = "";
  //   if (avatarImage) {
  //     const S =
  //       "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  //     const N = 16;
  //     const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
  //       .map((n) => S[n % S.length])
  //       .join("");
  //     const fileName = randomChar + "_" + avatarImage.name;
  //     await storage.ref(`avatars/${fileName}`).put(avatarImage);
  //     url = await storage.ref("avatars").child(fileName).getDownloadURL();
  //   }
  //   axios.post("http://localhost:3000/signup",
  //     {
  //         user: {
  //             name: username,
  //             email: email,
  //             password: password,
  //         }
  //     },
  //     { withCredentials: true }
  //   ).then(response => {
  //       console.log("registration res", response)
  //   }).catch(error => {
  //       console.log("registration error", error)
  //   })
  //   dispatch(
  //     updateUserProfile({
  //       displayName: username,
  //       photoUrl: url,
  //     })
  //   )
  // }
  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="sm:col-span-8 md:col-span-7">
        {/* <img src={`${process.env.PUBLIC_URL}/preview.png`} alt=""/> */}
      </div>
      <div className="sm:col-span-4 md:col-span-5 my-auto">
        <div className={styles.authForm}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <h3 className="text-gray-300 font-bold text-xl my-3">
            {isLogin ? "ログイン" : "会員登録"}
          </h3>
          <form className="flex flex-col items-center w-9/12" noValidate>
            {!isLogin && (
              <>
                <input
                  placeholder="名前"
                  className="w-full mt-4 bg-inputBg text-whiteSmoke rounded-3xl outline-none border-none px-4 py-3 text-lg"
                  required
                  id="username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUserName(e.target.value)
                  }}
                />
                <Box textAlign="center">
                  <IconButton className="focus:outline-none">
                    <label>
                      <AccountCircleIcon
                        fontSize="large"
                        className={
                          avatarImage
                            ? "cursor-pointer text-setAvatarBtn"
                            : "cursor-pointer text-gray-300"
                        }
                      />
                      <input
                        className="text-center hidden"
                        type="file"
                        onChange={onChangeImageHandler}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}
            <input
              placeholder="メールアドレス"
              className="w-full mt-4 bg-inputBg text-whiteSmoke rounded-3xl outline-none border-none px-4 py-3 text-lg"
              required
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
              }}
            />
            <input
              placeholder="パスワード"
              className="w-full mt-4 bg-inputBg text-whiteSmoke rounded-3xl outline-none border-none px-4 py-3 text-lg"
              required
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
              }}
            />
            <Button
              disabled={
                isLogin
                ? !email || password.length < 6
                : !username || !email || password.length < 6 || !avatarImage
              }
              fullWidth
              variant="contained"
              color="primary"
              className="text-gray-300 my-4 focus:outline-none"
              startIcon={<EmailIcon />}
              onClick={
                isLogin
                  ? async () => {
                    try {
                      await signInEmail();
                    } catch(err) {
                      alert(err.message);
                    }
                  }
                  : async () => {
                    try {
                      await signUpEmailWithFirebase();
                    } catch (err) {
                      alert(err.message);
                    }
                  }
              }
            >
              {isLogin ? "ログイン" : "登録"}
            </Button>
            <Grid container>
              <Grid item xs>
                <span
                  className="cursor-pointer text-gray-300"
                  onClick={() => setOpenModal(true)}
                >
                  パスワードをお忘れですか？
                </span>
                </Grid>
              <Grid item>
                <span className="cursor-pointer text-blue-500" onClick={()=>setIsLogin(!isLogin)}>
                  {isLogin ? "アカウントを新規作成する" : "ログイン"}
                </span>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="mt-4 focus:outline-none"
              onClick={signInGoogle}
              startIcon={<CameraIcon/>}
            >
              SignIn with Google
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="mt-4 focus:outline-none"
              onClick={testLogin}
            >
              おためしユーザーとしてログイン
            </Button>
          </form>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div style={getModalStyle()} className={classes.modal}>
              <div className="text-center">
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="Reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value);
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon/>
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
export default Auth;
