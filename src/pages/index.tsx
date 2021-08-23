import { Box, CircularProgress } from "@material-ui/core";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import SignInMenu from "../components/pages/index/signInMenu";
import firebase from "firebase";
import { AccountCircle } from "@material-ui/icons";
import { auth } from "../scripts/firebase";
import { AccountMenu } from "../components/pages/index/accountMenu";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<firebase.User>();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && setUser(user);
      setLoading(false);
    });
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
        {(() => {
          if (loading)
            return <CircularProgress size={20} style={{ margin: 5 }} />;
          if (user) {
            return <AccountMenu />;
          } else {
            return <SignInMenu setUser={setUser} />;
          }
        })()}
      </Box>
    </Box>
  );
};

export default Home;
