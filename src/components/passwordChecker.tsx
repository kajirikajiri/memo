import { CheckCircle, RadioButtonUnchecked } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/system";
import { NextPage } from "next";

const useStyles = makeStyles({
  activatedFont: {
    color: "#1976d2",
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "5px",
  },
  whiteOutFont: {
    display: "inline-block",
    color: "#ffffff",
    fontSize: "14pt",
    letterSpacing: "7px",
    textShadow: `2px  2px 0px #000000,
      -2px  2px 0px #000000,
       2px -2px 0px #000000,
      -2px -2px 0px #000000,
       2px  0px 0px #000000,
       0px  2px 0px #000000,
      -2px  0px 0px #000000,
       0px -2px 0px #000000`,
  },
});
interface Props {
  password: string;
}
export const PasswordChecker: NextPage<Props> = ({ password }) => {
  const classes = useStyles();
  const isLowerCase = (str: string) =>
    str == str.toLowerCase() && str != str.toUpperCase();
  const hasLowerCase = (str: string) =>
    str
      .split("")
      .map((c) => isLowerCase(c))
      .some((v) => v);
  const isUpperCase = (str: string) =>
    str != str.toLowerCase() && str == str.toUpperCase();
  const hasUpperCase = (str: string) =>
    str
      .split("")
      .map((c) => isUpperCase(c))
      .some((v) => v);
  const hasNumber = (str: string) => /\d/.test(str);
  return (
    <Box
      height={75}
      width="100%"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      {
        <Box display="flex" justifyContent="space-around">
          {[...Array(8)].map((_, i) => {
            return password.length > i ? (
              <CheckCircle
                key={`c${i}`}
                color={password.length > 7 ? "primary" : "action"}
                fontSize="small"
              ></CheckCircle>
            ) : (
              <RadioButtonUnchecked
                key={`r${i}`}
                fontSize="small"
              ></RadioButtonUnchecked>
            );
          })}
        </Box>
      }
      <Box
        display="flex"
        width="100%"
        height={30}
        alignItems="center"
        justifyContent="space-around"
      >
        <Box
          className={
            hasLowerCase(password)
              ? classes.activatedFont
              : classes.whiteOutFont
          }
        >
          a
        </Box>
        <Box
          className={
            hasUpperCase(password)
              ? classes.activatedFont
              : classes.whiteOutFont
          }
        >
          A
        </Box>
        <Box
          className={
            hasNumber(password) ? classes.activatedFont : classes.whiteOutFont
          }
        >
          0
        </Box>
      </Box>
    </Box>
  );
};
