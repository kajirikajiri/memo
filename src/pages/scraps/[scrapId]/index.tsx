import { useMutation, useQuery } from "@apollo/client";
import { TextField } from "@material-ui/core";
import gql from "graphql-tag";
import { useSnackbar } from "material-ui-snackbar-provider";
import { useRouter } from "next/router";
import { useState } from "react";
import { AccountMenuLayout } from "../../../components/layout/accountMenuLayout";
import { ScrapList } from "../../../components/pages/scraps/scrapId/scrapList";
import { ScrapTitle } from "../../../components/pages/scraps/scrapId/scrapTitle";

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

  return (
    <AccountMenuLayout>
      <ScrapTitle />
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
    </AccountMenuLayout>
  );
};

export default ScrapId;
