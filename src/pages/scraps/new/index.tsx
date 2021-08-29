import {
  Button,
  IconButton,
  TextField,
  Tooltip,
  Paper,
  Fade,
  Zoom,
  Skeleton,
} from "@material-ui/core";
import { Box } from "@material-ui/system";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { auth } from "../../../scripts/firebase";
import firebase from "firebase";
import { useSnackbar } from "material-ui-snackbar-provider";
import { AccountMenuLayout } from "../../../components/layout/accountMenuLayout";
import { HelpOutline } from "@material-ui/icons";
import { isDesktop } from "react-device-detect";

const CREATE_SCRAP = gql`
  mutation CreateScrap($userId: String!, $title: String!) {
    createScrap(createScrapInput: { userId: $userId, title: $title }) {
      id
    }
  }
`;

const ScrapNew = () => {
  const snackbar = useSnackbar();
  const router = useRouter();
  const [user, setUser] = useState<firebase.User>();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && setUser(user);
    });
  }, []);
  const [createScrap, { data, loading, error }] = useMutation(CREATE_SCRAP);
  const handleSubmit = async (e: React.KeyboardEvent) => {
    if (!loading && e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      await handleClick();
    }
  };
  const handleClick = async () => {
    if (!(text.length > 0)) {
      snackbar.showMessage("1文字以上入力してください", "close");
      return;
    }
    try {
      const { data } = await createScrap({
        variables: { title: text, userId: user?.uid },
      });
      if (typeof data.createScrap.id === "string")
        router.push(`/scraps/${data.createScrap.id}`);
    } catch (_) {
      snackbar.showMessage("作成に失敗", "close");
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.currentTarget.value);
  };
  const loadingComponent = () => {
    return (
      <Box
        display="flex"
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={"80vh"}
          style={{ maxHeight: 550, maxWidth: 295 }}
        />
      </Box>
    );
  };
  return (
    <AccountMenuLayout loadingComponent={loadingComponent()}>
      <Fade in={true} timeout={{ enter: 1000 }}>
        <Box
          display="flex"
          minHeight="100vh"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <Paper>
            <Box
              height="80vh"
              maxHeight={550}
              display="flex"
              alignItems="center"
              width="100%"
              padding={2}
              maxWidth={450}
            >
              <Box display="flex">
                <Fade in={text.length > 0}>
                  <Tooltip
                    TransitionComponent={Zoom}
                    leaveTouchDelay={4000}
                    placement="top-end"
                    title={
                      <ul style={{ padding: "0 5px 0 15px", margin: 0 }}>
                        <li>enterで改行できます</li>
                        {isDesktop && <li>ctrl + enterで確定できます</li>}
                      </ul>
                    }
                    open={open}
                    onClose={handleClose}
                  >
                    <IconButton
                      onMouseOver={handleOpen}
                      onClick={handleOpen}
                      aria-label="question"
                    >
                      <HelpOutline />
                    </IconButton>
                  </Tooltip>
                </Fade>
                <TextField
                  variant="standard"
                  fullWidth
                  autoFocus
                  onChange={handleChange}
                  multiline
                  required
                  type="text"
                  defaultValue=""
                  onKeyDown={handleSubmit}
                ></TextField>
                <Box width={10}></Box>
                <Fade in={text.length > 0}>
                  <Button
                    style={{ minWidth: 0 }}
                    color="inherit"
                    onClick={handleClick}
                  >
                    ok
                  </Button>
                </Fade>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </AccountMenuLayout>
  );
};

export default ScrapNew;
