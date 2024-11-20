import { BannerObject } from "../types";
import styles from "../styles/modules/Sidebar.module.scss";

interface SidebarProps {
  setObjects: React.Dispatch<React.SetStateAction<BannerObject[]>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setObjects }) => {
  const addText = () => {
    setObjects((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "text",
        x: 50,
        y: 50,
        content: "Текст",
        fontSize: 16,
        color: "#000",
      },
    ]);
  };

  const addImage = () => {
    const imageUrl = prompt("Введіть URL зображення:");
    if (imageUrl) {
      setObjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "image",
          x: 50,
          y: 50,
          src: imageUrl,
          width: 200,
          height: 200,
        },
      ]);
    }
  };

  return (
    <div className={styles.sidebar}>
      <button onClick={addText}>Додати текст</button>
      <button onClick={addImage}>Додати зображення</button>
    </div>
  );
};

export default Sidebar;
