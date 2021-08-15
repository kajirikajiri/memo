import { Button, CircularProgress, TextField } from "@material-ui/core";
import { Box } from "@material-ui/system";
import { useSnackbar } from "material-ui-snackbar-provider";
import { NextPage } from "next";
import { useRef, useState } from "react";
import { auth } from "../../../scripts/firebase";

interface Props {
  handleClose: () => Promise<void>;
}
export const ForgotEmail: NextPage<Props> = ({ handleClose }) => {
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    try {
      e.preventDefault();
      const email = (emailRef.current as any).value;
      await auth.sendPasswordResetEmail(email, {
        url:
          process.env.NODE_ENV === "production"
            ? "https://memo.kajiri.dev"
            : "http://localhost:3000",
      });
    } catch (_) {
      // エラーを握りつぶす
    } finally {
      snackbar.showMessage("メールを送信しました", "close", () => null);
      setLoading(false);
      handleClose();
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
        <Box height={20}></Box>
        <Button disabled={loading} fullWidth variant="contained" type="submit">
          {loading ? (
            <CircularProgress size={24}></CircularProgress>
          ) : (
            "メール送信"
          )}
        </Button>
      </Box>
    </>
  );
};
