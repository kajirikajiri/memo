import { Button, CircularProgress } from "@material-ui/core";
import { Box } from "@material-ui/system";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useRouter } from "next/router";
import { useState } from "react";
import { auth } from "../../scripts/firebase";

const Dashboard = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const [buttonLoading, setButtonLoading] = useState(false);
  const handleSignOut = () => {
    try {
      setButtonLoading(true);
      auth
        .signOut()
        .then(() => {
          router.push("/");
        })
        .catch((_) => {
          snackbar.showMessage("ログアウトに失敗しました", "close", () => null);
        });
    } finally {
      setButtonLoading(false);
    }
  };
  return (
    <Box display="flex" justifyContent="flex-end" width="100%">
      <Button onClick={handleSignOut}>
        {buttonLoading ? (
          <CircularProgress size={20}></CircularProgress>
        ) : (
          "ログアウト"
        )}
      </Button>
    </Box>
  );
};

export default Dashboard;
