import { AccountCircle } from "@material-ui/icons";
import { Dispatch, SetStateAction, useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { auth } from "../../../scripts/firebase";
import { useSnackbar } from "material-ui-snackbar-provider";
import { NextPage } from "next";
import firebase from "firebase";

interface Props {
  setUser: Dispatch<SetStateAction<firebase.User | undefined>>;
}

export const AccountMenu: NextPage<Props> = ({ setUser }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const snackbar = useSnackbar();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLoggedOut = () => {
    snackbar.showMessage("ログアウトしています。", "close");
    auth
      .signOut()
      .then(() => {
        setUser(undefined);
        setTimeout(() => {
          snackbar.showMessage("ログアウトしました！！", "close");
          router.push("/");
        }, 1000);
      })
      .catch(() => {
        snackbar.showMessage("失敗しました。", "close");
      });
  };
  return (
    <>
      <IconButton
        style={{ padding: 0 }}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => router.push("/scraps")}>Scrap一覧</MenuItem>
        <MenuItem onClick={() => router.push("/scraps/new")}>
          Scrap作成
        </MenuItem>
        <MenuItem onClick={handleLoggedOut}>ログアウト</MenuItem>
      </Menu>
    </>
  );
};
