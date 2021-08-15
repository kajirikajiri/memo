import { Box, Button, Dialog, DialogContent } from "@material-ui/core";
import type { NextPage } from "next";
import { provider } from "../scripts/firebase";
import { useEffect, useState } from "react";
import firebase from "firebase";
import { SignUp } from "../components/pages/index/signUp";
import { SignIn } from "../components/pages/index/signIn";
import { Layout } from "../components/layout";
import { useRouter } from "next/router";
import { ForgotEmail } from "../components/pages/index/forgotEmail";
import { useSnackbar } from "material-ui-snackbar-provider";
import { Email, Google } from "@material-ui/icons";

type Sign = "signIn" | "signUp";
type DialogType = "signInOrSignUp" | "forgotPassword";

const Home: NextPage = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { pageState, dialogState } = router.query;
  const [signType, setSignType] = useState<Sign>("signUp");
  const [dialogType, setDialogType] = useState<DialogType>("signInOrSignUp");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (pageState === "signIn") setSignType("signIn");
    if (dialogState === "email") {
      setDialogType("signInOrSignUp");
      setOpen(true);
    }
  }, [pageState, dialogState]);
  const isSignIn = signType === "signIn";
  const handleChangeSignType = async () => {
    setSignType(isSignIn ? "signUp" : "signIn");
  };
  const firebaseSignIn = async () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        result.user && router.push("/dashboard");
        /** @type {firebase.auth.OAuthCredential} */
      })
      .catch((_) => {
        snackbar.showMessage("ログインに失敗しました", "close", () => null);
      });
  };
  const handleClose = async () => {
    setOpen(false);
  };
  const handleOpen = async () => {
    setDialogType("signInOrSignUp");
    setOpen(true);
  };
  const handleOpenForgotPassword = async () => {
    setDialogType("forgotPassword");
    setOpen(true);
  };
  return (
    <Layout>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
        alignItems="center"
      >
        <Box width="100%" display="flex" justifyContent="flex-end">
          <Button onClick={handleChangeSignType}>
            {!isSignIn ? "ログイン" : "登録"}
          </Button>
        </Box>
        <Box width={200}>
          <Button
            startIcon={<Email />}
            fullWidth
            variant="contained"
            onClick={handleOpen}
          >
            emailで{isSignIn ? "ログイン" : "登録"}
          </Button>
          <Box height={10}></Box>
          <Button
            startIcon={<Google />}
            fullWidth
            variant="contained"
            onClick={firebaseSignIn}
          >
            Googleで{isSignIn ? "ログイン" : "登録"}
          </Button>
          <Box height={10}></Box>
          <Button fullWidth onClick={handleOpenForgotPassword}>
            パスワードを忘れた
          </Button>
        </Box>
        <Dialog onClose={handleClose} open={open}>
          <DialogContent>
            {(() => {
              if (dialogType === "forgotPassword") {
                return <ForgotEmail handleClose={handleClose} />;
              } else {
                if (isSignIn) {
                  return <SignIn />;
                } else {
                  return <SignUp />;
                }
              }
            })()}
          </DialogContent>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Home;
