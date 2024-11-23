import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BannerProvider } from "./context/BannerContext";
import Sidebar from "./components/Sidebar";
import BannerArea from "./components/BannerArea";
import ObjectProperties from "./components/ObjectProperties";
const App = () => {
    return (_jsx(BannerProvider, { children: _jsxs("div", { className: "app", children: [_jsx(Sidebar, {}), _jsx(BannerArea, {}), _jsx(ObjectProperties, {})] }) }));
};
export default App;
