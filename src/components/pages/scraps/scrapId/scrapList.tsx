import { Box } from "@material-ui/system";
import { CircularProgress } from "@material-ui/core";
import { NextPage } from "next";

interface Props {
  loading: boolean;
  data: any;
}

export const ScrapList: NextPage<Props> = ({ loading, data }) => {
  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        (data.threads as { id: string; text: string }[]).map((t) => (
          <Box key={t.id}>{t.text}</Box>
        ))
      )}
    </>
  );
};
