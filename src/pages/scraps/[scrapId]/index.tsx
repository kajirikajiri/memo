import { useRouter } from "next/router";

const ScrapId = () => {
  const router = useRouter();
  const { scrapId } = router.query;
  return <>{scrapId}</>;
};

export default ScrapId;
