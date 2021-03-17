import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout, setShowUser } from "./features/userSlice";
import { auth } from "./firebase";
import Auth from "./components/Auth/Auth";
import Feed from "./components/Feed/Feed";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
        dispatch(
          setShowUser({
            name: authUser.displayName,
            avatar: authUser.photoURL,
          })
        )
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);
  return (
    <>
      {user.uid ? (
        <div className="flex justify-center h-screen bg-appBg 2xl:px-64 px-32">
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
