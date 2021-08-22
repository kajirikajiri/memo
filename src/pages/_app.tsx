import "../styles/globals.css";
import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../components/theme";
import { SnackbarProvider } from "material-ui-snackbar-provider";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const CustomApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles: Element | null =
      document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const client = new ApolloClient({
    uri:
      process.env.NODE_ENV === "production"
        ? "http://sample-1912224381.ap-northeast-1.elb.amazonaws.com/graphql"
        : "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <StylesProvider>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            ButtonProps={{ color: "info" }}
            SnackbarProps={{
              autoHideDuration: 4000,
              anchorOrigin: { horizontal: "center", vertical: "top" },
            }}
          >
            <CssBaseline />
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </StylesProvider>
    </ApolloProvider>
  );
};

export default CustomApp;
