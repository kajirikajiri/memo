import { useMutation, useQuery } from "@apollo/client";
import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Box } from "@material-ui/system";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { FixedSizeList, ListChildComponentProps } from "react-window";

const SCRAPS = gql`
  {
    scraps {
      title
      id
    }
  }
`;

const REMOVE_SCRAP = gql`
  mutation Remove($id: String!) {
    removeScrap(id: $id) {
      id
    }
  }
`;

const Scraps = () => {
  const { data, loading, refetch } = useQuery(SCRAPS);
  const router = useRouter();
  const [removeScrap] = useMutation(REMOVE_SCRAP);
  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.stopPropagation();
    if (confirm("削除？")) {
      const { data } = await removeScrap({ variables: { id } });
      if (typeof data.removeScrap.id === "string") refetch();
    }
  };
  function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;

    return (
      <ListItem
        button
        onClick={() => router.push(`/scraps/${data.scraps[index].id}`)}
        style={{ ...style, ...{ borderBottom: "1px solid lightgrey" } }}
        key={index}
      >
        <ListItemText primary={`${data.scraps[index].title}`} />
        <IconButton
          id={`my-icon-button-${index}`}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={(e) => handleClick(e, data.scraps[index].id)}
        >
          <Delete />
        </IconButton>
      </ListItem>
    );
  }
  return (
    <Box width="100%" display="flex" justifyContent="center">
      {loading ? (
        <CircularProgress size={30} />
      ) : (
        <Paper id="my-paper" style={{ marginTop: 20 }}>
          <FixedSizeList
            height={250}
            width={300}
            itemSize={46}
            itemCount={data.scraps.length}
          >
            {renderRow}
          </FixedSizeList>
        </Paper>
      )}
    </Box>
  );
};

export default Scraps;
