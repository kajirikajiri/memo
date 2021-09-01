import { useMutation, useQuery } from "@apollo/client";
import {
  CircularProgress,
  Fade,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  Zoom,
} from "@material-ui/core";
import { Done } from "@material-ui/icons";
import gql from "graphql-tag";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SCRAP = gql`
  query SCRAP($id: String!) {
    scrap(id: $id) {
      id
      title
    }
  }
`;

const UPDATE_SCRAP_TITLE = gql`
  mutation UPDATE_SCRAP_TITLE($id: String!, $title: String!) {
    updateScrap(updateScrapInput: { id: $id, title: $title }) {
      id
    }
  }
`;

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

export const ScrapTitle = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { scrapId } = router.query;
  const { data, loading } = useQuery(SCRAP, { variables: { id: scrapId } });
  const [updateScrap] = useMutation(UPDATE_SCRAP_TITLE);
  const [inputFocus, setInputFocus] = useState(false);
  const [buttonFocus, setButtonFocus] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      await Promise.all([
        sleep(2000),
        updateScrap({ variables: { id: scrapId, title } }),
      ]);
      setInputFocus(false);
      snackbar.showMessage("タイトルを更新", "close");
    } catch {
      snackbar.showMessage("更新失敗", "close");
    } finally {
      setUpdateLoading(false);
    }
    return null;
  };
  const [title, setTitle] = useState("");
  useEffect(() => {
    if (data?.scrap?.title) {
      setTitle(data.scrap.title);
    }
  }, [loading]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

  const inputAdornmentIcon = () => {
    const showIconButton = inputFocus || (inputFocus && buttonFocus);
    if (updateLoading) {
      return <CircularProgress />;
    } else if (showIconButton) {
      return (
        <Zoom in={showIconButton}>
          <IconButton
            onFocus={() => setButtonFocus(true)}
            onBlur={() => setButtonFocus(false)}
            onClick={handleSave}
          >
            <Done fontSize="large" />
          </IconButton>
        </Zoom>
      );
    }
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <TextField
          onBlur={() => setTimeout(() => setInputFocus(false), 300)}
          onFocus={() => setInputFocus(true)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {inputAdornmentIcon()}
              </InputAdornment>
            ),
          }}
          fullWidth
          multiline
          onChange={handleChange}
          inputProps={{
            style: { fontSize: 48, lineHeight: 1.4, paddingLeft: 8 },
          }}
          variant="standard"
          value={title}
        />
      )}
    </>
  );
};
