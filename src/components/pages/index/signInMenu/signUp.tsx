import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import type { NextPage } from "next";
import { auth } from "../../../../scripts/firebase";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useRouter } from "next/router";
import { PasswordChecker } from "../../../passwordChecker";
import { passwordRegex } from "../../../../scripts/regex";
import { useSnackbar } from "material-ui-snackbar-provider";
import { Lock, NoEncryption } from "@material-ui/icons";
import firebase from "firebase";

interface Props {
  setUser: Dispatch<SetStateAction<firebase.User | undefined>>;
}

export const SignUp: NextPage<Props> = ({ setUser }) => {
  const router = useRouter();
  const snackbar = useSnackbar();
  // https://stackoverflow.com/a/20461010
  // eslint-disable-next-line no-useless-escape
  const emailRegex = "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [password, setPassword] = useState("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      e.preventDefault();
      const email = (emailRef.current as any).value;
      const password = (passwordRef.current as any).value;
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      user && setUser(user);
    } catch (_) {
      snackbar.showMessage("登録に失敗しました", "close", () => null);
    } finally {
      setTimeout(() => setLoading(false), 5000);
    }
  };
  const handleChange = async (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.currentTarget.value);
  };
  return (
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
        inputProps={{ pattern: emailRegex }}
      />
      <Box height={10}></Box>
      {passwordFocus && <PasswordChecker password={password} />}
      <TextField
        fullWidth
        inputRef={passwordRef}
        required
        label="password"
        defaultValue=""
        type={visible ? "text" : "password"}
        inputProps={{ pattern: passwordRegex }}
        onFocus={() => setPasswordFocus(true)}
        onChange={handleChange}
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
        {loading ? <CircularProgress size={24}></CircularProgress> : "登録"}
      </Button>
    </Box>
  );
};
