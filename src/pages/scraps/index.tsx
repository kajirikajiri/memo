import { useMutation, useQuery } from "@apollo/client";
import { Button, CircularProgress, IconButton, Paper } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
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

const useStyles = makeStyles({
  button: {
    "&:hover": {
      backgroundColor: "#00000010",
    },
  },
});

const Scraps = () => {
  const classes = useStyles();
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
            maxWidth={450}
            flexDirection="column"
            component={Paper}
          >
            {data.scraps.map((s: any, i: number) => {
              return (
                <Box
                  key={s.id}
                  className={classes.button}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/scraps/${s.id}`)}
                  paddingY={1.5}
                  paddingX={1}
                  width="100%"
                  borderTop={0 === i ? "" : "1px solid"}
                  borderColor="lightgrey"
                  textOverflow="ellipsis"
                  overflow="hidden"
                >
                  {s.title}
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
