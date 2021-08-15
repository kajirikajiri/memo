import { Box } from "@material-ui/core";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import SignInMenu from "../components/pages/index/signInMenu";
import firebase from "firebase";
import { AccountCircle } from "@material-ui/icons";
import { auth } from "../scripts/firebase";

const Home: NextPage = () => {
  const [user, setUser] = useState<firebase.User>();
  useEffect(() => {
    auth.onAuthStateChanged((user) => user && setUser(user));
  }, []);
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      width="100%"
      alignItems="center"
    >
      <Box width="100%" display="flex" justifyContent="flex-end">
        {user ? <AccountCircle /> : <SignInMenu setUser={setUser} />}
      </Box>
    </Box>
  );
};

export default Home;
