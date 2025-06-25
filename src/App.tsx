import { Route, Routes } from "react-router-dom";
import { BannerProvider } from "./context/BannerContext";
import { ConfigProvider } from "./context/ConfigContext";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "../theme";
import Layout from "./components/Layout";
import { useAuth } from "./utils/useAuth";

const App: React.FC = () => {
  const { isAuthReady } = useAuth();
  return (
    <BannerProvider>
      <ConfigProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path="/:projectId"
              element={<Layout isAuthReady={isAuthReady} />}
            />
            <Route
              path="/project/:projectName"
              element={<Layout isAuthReady={isAuthReady} />}
            />
            <Route path="/" element={<Layout isAuthReady={isAuthReady} />} />
          </Routes>
        </ThemeProvider>
      </ConfigProvider>
    </BannerProvider>
  );
};

export default App;
