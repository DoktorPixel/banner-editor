import { Route, Routes } from "react-router-dom";
import { BannerProvider } from "./context/BannerContext";
import { ConfigProvider } from "./context/ConfigContext";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <BannerProvider>
      <ConfigProvider>
        <Routes>
          <Route path="/project/:projectName" element={<Layout />} />

          <Route path="/" element={<Layout />} />
        </Routes>
      </ConfigProvider>
    </BannerProvider>
  );
};

export default App;
