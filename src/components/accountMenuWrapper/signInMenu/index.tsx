import {
  Box,
  Button,
  Dialog,
  DialogContent,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import type { NextPage } from "next";
import { provider } from "../../../scripts/firebase";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import firebase from "firebase";
import { SignUp } from "./signUp";
import { SignIn } from "./signIn";
import { useRouter } from "next/router";
import { ForgotEmail } from "./forgotEmail";
import { useSnackbar } from "material-ui-snackbar-provider";
import {
  AssignmentTurnedIn,
  Email,
  ExitToApp,
  Google,
  Help,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  scrollPaper: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
});

type Sign = "signIn" | "signUp";
type DialogType = "signInOrSignUp" | "forgotPassword";

interface Props {
  setUser: Dispatch<SetStateAction<firebase.User | undefined>>;
}

export const SignInMenu: NextPage<Props> = ({ setUser }) => {
  const classes = useStyles();
  const router = useRouter();
  const snackbar = useSnackbar();
  const { pageState, dialogState } = router.query;
  const [signType, setSignType] = useState<Sign>("signIn");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
  const handleClickMenu = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChangeSignType = () => {
    setSignType(isSignIn ? "signUp" : "signIn");
  };
  const firebaseSignIn = async () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        result.user && setUser(result.user);
      })
      .catch((_) => {
        snackbar.showMessage(
          "Googleログインに失敗しました",
          "close",
          () => null
        );
      });
  };
  const handleCloseDialog = async () => {
    setOpen(false);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleOpen = async () => {
    setDialogType("signInOrSignUp");
    setOpen(true);
  };
  const handleOpenForgotPassword = async () => {
    setDialogType("forgotPassword");
    setOpen(true);
  };
  const menuItems = [
    {
      icon: <Email />,
      text: `emailで${isSignIn ? "ログイン" : "登録"}`,
      func: handleOpen,
    },
    {
      icon: <Google />,
      text: `Googleで${isSignIn ? "ログイン" : "登録"}`,
      func: firebaseSignIn,
    },
    {
      icon: <Help />,
      text: `パスワードを忘れた`,
      func: handleOpenForgotPassword,
    },
    {
      icon: isSignIn ? <AssignmentTurnedIn /> : <ExitToApp />,
      text: isSignIn ? "登録" : "ログイン",
      func: handleChangeSignType,
    },
  ];
  return (
    <>
      <Box>
        <Button style={{ padding: 0 }} onClick={handleClickMenu}>
          {isSignIn ? "ログイン" : "登録"}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          {menuItems.map((m, i) => (
            <MenuItem onClick={m.func} key={i}>
              <ListItemIcon>{m.icon}</ListItemIcon>
              <ListItemText>{m.text}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Dialog
        classes={{
          scrollPaper: classes.scrollPaper,
        }}
        onClose={handleCloseDialog}
        open={open}
      >
        <DialogContent>
          {(() => {
            if (dialogType === "forgotPassword") {
              return <ForgotEmail handleClose={handleCloseDialog} />;
            } else {
              return isSignIn ? (
                <SignIn setUser={setUser} />
              ) : (
                <SignUp setUser={setUser} />
              );
            }
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
};
