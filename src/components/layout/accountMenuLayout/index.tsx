import { Box } from "@material-ui/system";
import { NextPage } from "next";
import { AccountMenuWrapper } from "../../accountMenuWrapper";

export const AccountMenuLayout: NextPage = ({ children }) => {
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Box width="100%" display="flex" justifyContent="flex-end">
          <AccountMenuWrapper />
        </Box>
        {children}
      </Box>
    </>
  );
};
