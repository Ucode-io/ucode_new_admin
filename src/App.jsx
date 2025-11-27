import {Suspense} from "react";
import Router from "./router";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider, createTheme, CssBaseline} from "@mui/material";
import {StyledEngineProvider} from "@mui/material/styles";
import {PersistGate} from "redux-persist/integration/react";
import {persistor, store} from "./store";
import {Provider} from "react-redux";
import {QueryClientProvider} from "react-query";
import queryClient from "./queries";
import AlertProvider from "./providers/AlertProvider";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
    },
    secondary: {
      main: "#7c3aed",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Suspense fallback="Loading...">
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <AlertProvider>
                  <BrowserRouter>
                    <Router />
                  </BrowserRouter>
                </AlertProvider>
              </ThemeProvider>
            </PersistGate>
          </Provider>
        </QueryClientProvider>
      </Suspense>
    </StyledEngineProvider>
  );
}

export default App;
