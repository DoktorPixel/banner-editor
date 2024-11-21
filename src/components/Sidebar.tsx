import { useBanner } from "../context/BannerContext";

const Sidebar: React.FC = () => {
  const { addObject, undo, redo, canUndo, canRedo } = useBanner();

  const addText = () => {
    const content = prompt("Введіть текст", "Текст");
    const fontSize = parseInt("16");
    const color = "#000000";

    addObject({
      id: Date.now(),
      type: "text",
      x: 50,
      y: 50,
      content: content || "Текст",
      fontSize,
      color: color || "#000000",
    });
  };

  const addImage = () => {
    const src = prompt(
      "Введите URL изображения",
      "https://via.placeholder.com/300"
    );

    addObject({
      id: Date.now(),
      type: "image",
      x: 50,
      y: 50,
      src: src || "https://via.placeholder.com/300",
    });
  };

  return (
    <div className="sidebar">
      <button onClick={addText}>Додати текст</button>
      <button onClick={addImage}>Додати зображення</button>
      <hr />
      <button onClick={undo} disabled={!canUndo}>
        Назад
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Вперед
      </button>
    </div>
  );
};

export default Sidebar;
