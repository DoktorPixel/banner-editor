import { useBanner } from "../context/BannerContext";

const Sidebar: React.FC = () => {
  const { addObject } = useBanner();

  const addText = () => {
    addObject({
      id: Date.now(),
      type: "text",
      x: 50,
      y: 50,
      content: "Текст",
      fontSize: 16,
      color: "#000",
    });
  };

  const addImage = () => {
    addObject({
      id: Date.now(),
      type: "image",
      x: 50,
      y: 50,
      src: "https://via.placeholder.com/300",
    });
  };

  return (
    <div className="sidebar">
      <button onClick={addText}>Добавить текст</button>
      <button onClick={addImage}>Добавить изображение</button>
    </div>
  );
};

export default Sidebar;
