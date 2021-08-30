import { useMutation, useQuery } from "@apollo/client";
import { Button, CircularProgress, IconButton, Paper } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Box } from "@material-ui/system";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { AccountMenuLayout } from "../../components/layout/accountMenuLayout";

const SCRAPS = gql`
  {
    scraps {
      title
      id
    }
  }
`;

const Scraps = () => {
  const { data, loading } = useQuery(SCRAPS);
  const router = useRouter();

  return (
    <AccountMenuLayout>
      <Box width="100%" display="flex" justifyContent="center">
        {loading ? (
          <CircularProgress size={30} />
        ) : (
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            padding={2}
            maxWidth={450}
            flexDirection="column"
          >
            {data.scraps.map((scrap: any) => {
              return (
                <Box marginBottom={2} width="100%">
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    onClick={() => router.push(`/scraps/${scrap.id}`)}
                    key={scrap.id}
                    style={{ textTransform: "none" }}
                  >
                    {scrap.title}
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </AccountMenuLayout>
  );
};

export default Scraps;
