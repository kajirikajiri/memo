import {
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { NextPage } from "next";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { auth } from "../../../scripts/firebase";
import { useRouter } from "next/router";
import { useSnackbar } from "material-ui-snackbar-provider";
import { Lock, NoEncryption } from "@material-ui/icons";
import firebase from "firebase";

interface Props {
  setUser: Dispatch<SetStateAction<firebase.User | undefined>>;
}

export const SignIn: NextPage<Props> = ({ setUser }) => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      e.preventDefault();
      const email = (emailRef.current as any).value;
      const password = (passwordRef.current as any).value;
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      user && setUser(user);
      snackbar.showMessage("ログインに成功しました", "close", () => null);
    } catch (_) {
      snackbar.showMessage("ログインに失敗しました", "close", () => null);
    } finally {
      setTimeout(() => setLoading(false), 5000);
    }
  };
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        component="form"
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          inputRef={emailRef}
          required
          type="email"
          label="email"
          defaultValue=""
        />
        <Box height={10}></Box>

        <TextField
          fullWidth
          inputRef={passwordRef}
          required
          type={visible ? "text" : "password"}
          label="password"
          defaultValue=""
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" style={{ cursor: "pointer" }}>
                {visible ? (
                  <NoEncryption onClick={() => setVisible(!visible)} />
                ) : (
                  <Lock onClick={() => setVisible(!visible)} />
                )}
              </InputAdornment>
            ),
          }}
        />
        <Box height={20}></Box>
        <Button disabled={loading} fullWidth variant="contained" type="submit">
          {loading ? (
            <CircularProgress size={24}></CircularProgress>
          ) : (
            "ログイン"
          )}
        </Button>
      </Box>
    </>
  );
};
