import { useMutation, useQuery } from "@apollo/client";
import { Button, IconButton, Paper, TextField } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { Box } from "@material-ui/system";
import gql from "graphql-tag";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useRouter } from "next/router";
import { useState } from "react";
import { AccountMenuLayout } from "../../../components/layout/accountMenuLayout";
import { ScrapList } from "../../../components/pages/scraps/scrapId/scrapList";
import { ScrapTitle } from "../../../components/pages/scraps/scrapId/scrapTitle";

const REMOVE_SCRAP = gql`
  mutation Remove($id: String!) {
    removeScrap(id: $id) {
      id
    }
  }
`;

const CREATE_THREAD = gql`
  mutation CREATE_THREAD($text: String!, $scrapId: String!) {
    createThread(createThreadInput: { text: $text, scrapId: $scrapId }) {
      id
    }
  }
`;

const THREADS = gql`
  query THREADS($scrapId: String!) {
    threads(scrapId: $scrapId) {
      id
      text
    }
  }
`;

const ScrapId = () => {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { scrapId } = router.query;
  const [createThread, { loading: createLoading }] = useMutation(CREATE_THREAD);
  const [removeScrap] = useMutation(REMOVE_SCRAP);
  const { data, loading, refetch } = useQuery(THREADS, {
    variables: { scrapId: scrapId },
  });
  const [text, setText] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!createLoading && e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      try {
        if (!(text.length >= 1)) {
          snackbar.showMessage("1文字以上", "close");
          return;
        }
        createThread({ variables: { text, scrapId } }).then(async () => {
          setText("");
          await refetch();
        });
      } catch (_) {
        snackbar.showMessage("作成に失敗", "close");
      }
    }
  };
  const handleClickDelete = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    if (confirm("削除？")) {
      const { data } = await removeScrap({ variables: { id: scrapId } });
      if (typeof data.removeScrap.id === "string") refetch();
    }
  };

  return (
    <AccountMenuLayout>
      <Box component={Paper} marginX={1} marginTop={5} paddingBottom={3}>
        <Box display="flex" width="100%" justifyContent="flex-end">
          <Button
            style={{ minWidth: 0 }}
            aria-haspopup="true"
            onClick={handleClickDelete}
          >
            <Clear color="disabled" />
          </Button>
        </Box>
        <Box paddingX={3}>
          <Box
            marginTop={4}
            marginBottom={7}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <ScrapTitle />
          </Box>
          <ScrapList data={data} loading={loading} />
          {
            <TextField
              onChange={handleChange}
              autoFocus
              multiline
              required
              type="text"
              defaultValue=""
              value={text}
              onKeyDown={handleKeyDown}
            />
          }
        </Box>
      </Box>
    </AccountMenuLayout>
  );
};

export default ScrapId;
