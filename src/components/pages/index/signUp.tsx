import { Box, Button, CircularProgress, TextField } from "@material-ui/core";
import type { NextPage } from "next";
import { auth } from "../../../scripts/firebase";
import { useRef, useState } from "react";
import { CheckCircle, RadioButtonUnchecked } from "@material-ui/icons";
import { useRouter } from "next/router";
import { PasswordChecker } from "../../passwordChecker";
import { passwordRegex } from "../../../scripts/regex";
import { useSnackbar } from "material-ui-snackbar-provider";

export const SignUp: NextPage = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  // https://stackoverflow.com/a/20461010
  // eslint-disable-next-line no-useless-escape
  const emailRegex = "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  // https://stackoverflow.com/a/14850765
  // 数値小文字大文字8文字以上
  const [loading, setLoading] = useState(false);
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
      user && router.push("/dashboard");
    } catch (_) {
      snackbar.showMessage("登録に失敗しました", "close", () => null);
    } finally {
      setLoading(false);
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
        inputRef={emailRef}
        required
        type="email"
        label="email"
        defaultValue=""
        inputProps={{ pattern: emailRegex }}
      />
      <Box height={10}></Box>
      <PasswordChecker password={password} />
      <TextField
        inputRef={passwordRef}
        required
        type="password"
        label="password"
        defaultValue=""
        inputProps={{ pattern: passwordRegex }}
        onFocus={() => setPasswordFocus(true)}
        onChange={handleChange}
      />
      <Box height={20}></Box>
      <Button disabled={loading} fullWidth variant="contained" type="submit">
        {loading ? <CircularProgress size={24}></CircularProgress> : "登録"}
      </Button>
    </Box>
  );
};
