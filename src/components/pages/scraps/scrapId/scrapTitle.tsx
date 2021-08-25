import { useQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import gql from "graphql-tag";
import { useRouter } from "next/router";

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
  return <>{loading ? <CircularProgress /> : <>{data.scrap.title}</>}</>;
};
