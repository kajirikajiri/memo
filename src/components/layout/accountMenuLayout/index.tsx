import { Box } from "@material-ui/system";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { AccountMenuWrapper } from "../../accountMenuWrapper";
import firebase from "firebase";
import { auth } from "../../../scripts/firebase";
import { CircularProgress } from "@material-ui/core";

export const AccountMenuLayout: NextPage = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<firebase.User>();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && setUser(user);
      setLoading(false);
    });
  }, []);
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Box width="100%" display="flex" justifyContent="flex-end">
          <AccountMenuWrapper loading={loading} user={user} setUser={setUser} />
        </Box>
        {!loading && user ? children : <></>}
      </Box>
    </>
  );
};
