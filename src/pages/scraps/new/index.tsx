import { TextField } from "@material-ui/core";
import { Box } from "@material-ui/system";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { auth } from "../../../scripts/firebase";
import firebase from "firebase";
import { useSnackbar } from "material-ui-snackbar-provider";
import { AccountMenuLayout } from "../../../components/layout/accountMenuLayout";

const CREATE_SCRAP = gql`
  mutation CreateScrap($userId: String!, $title: String!) {
    createScrap(createScrapInput: { userId: $userId, title: $title }) {
      id
    }
  }
`;

const ScrapNew = () => {
  const snackbar = useSnackbar();
  const textFieldRef = useRef("");
  const router = useRouter();
  const [user, setUser] = useState<firebase.User>();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && setUser(user);
    });
  }, []);
  const [createScrap, { data, loading, error }] = useMutation(CREATE_SCRAP);
  const handleSubmit = async (e: React.KeyboardEvent) => {
    if (!loading && e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      try {
        const text = (textFieldRef.current as any).value;
        const { data } = await createScrap({
          variables: { title: text, userId: user?.uid },
        });
        if (typeof data.createScrap.id === "string")
          router.push(`/scraps/${data.createScrap.id}`);
      } catch (_) {
        snackbar.showMessage("作成に失敗", "close");
      }
    }
  };
  return (
    <AccountMenuLayout>
      <Box display="flex" justifyContent="center" width="100%">
        <Box>
          <Box>
            <Box>enter: next line</Box>
            <Box>ctrl+enter: submit</Box>
          </Box>
          <TextField
            autoFocus
            inputRef={textFieldRef}
            multiline
            required
            type="text"
            defaultValue=""
            onKeyDown={handleSubmit}
          ></TextField>
        </Box>
      </Box>
    </AccountMenuLayout>
  );
};

export default ScrapNew;
