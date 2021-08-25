import { CircularProgress } from "@material-ui/core";
import type { NextPage } from "next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SignInMenu } from "./signInMenu";
import firebase from "firebase";
import { AccountMenu } from "./accountMenu";

interface Props {
  setUser: Dispatch<SetStateAction<firebase.User | undefined>>;
  user: firebase.User | undefined;
  loading: boolean;
}

export const AccountMenuWrapper: NextPage<Props> = ({
  user,
  setUser,
  loading,
}) => {
  return (
    <>
      {(() => {
        if (loading) return <CircularProgress size={24} />;
        if (user) {
          return <AccountMenu setUser={setUser} />;
        } else {
          return <SignInMenu setUser={setUser} />;
        }
      })()}
    </>
  );
};
