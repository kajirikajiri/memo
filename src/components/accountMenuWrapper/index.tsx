import { CircularProgress } from "@material-ui/core";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { SignInMenu } from "./signInMenu";
import firebase from "firebase";
import { auth } from "../../scripts/firebase";
import { AccountMenu } from "./accountMenu";

export const AccountMenuWrapper: NextPage = () => {
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
      {(() => {
        if (loading) return <CircularProgress size={24} />;
        if (user) {
          return <AccountMenu />;
        } else {
          return <SignInMenu setUser={setUser} />;
        }
      })()}
    </>
  );
};
