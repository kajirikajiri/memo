import { useMutation, useQuery } from "@apollo/client";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import {
  CheckCircle,
  CheckCircleOutline,
  Delete,
  Done,
  DoneOutline,
  Edit,
} from "@material-ui/icons";
import { Box } from "@material-ui/system";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { useState } from "react";

const SCRAP = gql`
  query SCRAP($id: String!) {
    scrap(id: $id) {
      id
      title
    }
  }
`;

export const ScrapTitle = () => {
  const router = useRouter();
  const { scrapId } = router.query;
  const { data, loading } = useQuery(SCRAP, { variables: { id: scrapId } });
  const [focus, setFocus] = useState(false);
  const handleSave = () => {
    return null;
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <TextField
          onBlur={() => setFocus(false)}
          onFocus={() => setFocus(true)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {focus && (
                  <IconButton onClick={handleSave}>
                    <Done fontSize="large" />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          fullWidth
          inputProps={{ style: { fontSize: 24, paddingLeft: 8 } }}
          variant="standard"
          value={data.scrap.title}
        />
      )}
    </>
  );
};
