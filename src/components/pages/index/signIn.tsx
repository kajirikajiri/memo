import { Button, CircularProgress, TextField } from "@material-ui/core";
import { Box } from "@material-ui/system";
import { NextPage } from "next";
import { useRef, useState } from "react";
import { auth } from "../../../scripts/firebase";
import { useRouter } from "next/router";
import { useSnackbar } from "material-ui-snackbar-provider";

export const SignIn: NextPage = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      e.preventDefault();
      const email = (emailRef.current as any).value;
      const password = (passwordRef.current as any).value;
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      user && router.push("/dashboard");
    } catch (_) {
      snackbar.showMessage("登録に失敗しました", "close", () => null);
    } finally {
      setLoading(false);
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
          inputRef={emailRef}
          required
          type="email"
          label="email"
          defaultValue=""
        />
        <Box height={10}></Box>

        <TextField
          inputRef={passwordRef}
          required
          type=""
          label="password"
          defaultValue=""
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
