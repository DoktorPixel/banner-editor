import { BannerProvider } from "./context/BannerContext";
import Sidebar from "./components/Sidebar";
import BannerArea from "./components/BannerArea";
import ObjectProperties from "./components/ObjectProperties";

const App: React.FC = () => {
  return (
    <BannerProvider>
      <div className="app">
        <Sidebar />

        <BannerArea />
        <ObjectProperties />
      </div>
    </BannerProvider>
  );
};

export default App;

