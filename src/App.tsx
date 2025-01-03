import { BannerProvider } from "./context/BannerContext";
import { ConfigProvider } from "./context/ConfigContext";

import Sidebar from "./components/Sidebar";
import BannerArea from "./components/BannerArea";
import ObjectProperties from "./components/ObjectProperties";
import Instructions from "./components/Instructions";
import InsertingProps from "./components/InsertingProps";
import { useMode } from "./context/ModeContext";

const App: React.FC = () => {
  const { mode } = useMode();
  return (
    <BannerProvider>
      <ConfigProvider>
        <div className="app">
          {mode === "dev" ? <Sidebar /> : <Instructions />}
          <BannerArea key={mode} />
          {mode === "dev" ? <ObjectProperties /> : <InsertingProps />}
        </div>
      </ConfigProvider>
    </BannerProvider>
  );
};

export default App;
