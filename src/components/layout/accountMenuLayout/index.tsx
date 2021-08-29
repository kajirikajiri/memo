import { Box } from "@material-ui/system";
import { NextPage } from "next";
import { ReactNode, useEffect, useState } from "react";
import { AccountMenuWrapper } from "../../accountMenuWrapper";
import firebase from "firebase";
import { auth } from "../../../scripts/firebase";
import { makeStyles } from "@material-ui/styles";
import { isMobile } from "react-device-detect";

const useStyles = makeStyles({
  mobile: {
    position: "absolute",
    right: 0,
    padding: 8,
    bottom: 0,
  },
  notMobile: {
    position: "absolute",
    right: 0,
    padding: 4,
    top: 0,
  },
});
interface Props {
  loadingComponent?: ReactNode;
}
export const AccountMenuLayout: NextPage<Props> = ({
  children,
  loadingComponent,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("");
  const [user, setUser] = useState<firebase.User>();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user && setUser(user);
      setLoading(false);
    });
    setClassName(isMobile ? classes.mobile : classes.notMobile);
  }, []);
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        minHeight={"100vh"}
        maxWidth={780}
        margin="0 auto"
        position="relative"
      >
        {!isMobile && <Box height={43} />}
        <Box className={className}>
          <AccountMenuWrapper loading={loading} user={user} setUser={setUser} />
        </Box>
        {loading && loadingComponent}
        {!loading && user ? children : <></>}
        {isMobile && <Box height={43} />}
      </Box>
    </>
  );
};
