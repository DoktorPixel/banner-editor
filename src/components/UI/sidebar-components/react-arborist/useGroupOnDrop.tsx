// react-arborist/useGroupOnDrop.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

type GroupProposal = {
  dragIds: number[]; // что тянули (в т.ч. множественный drag)
  targetRootId: number; // над чем дропнули
};

type GroupOnDropContextValue = {
  setHoveredRootId: (id: number | null) => void;
  getHoveredRootId: () => number | null;
  proposeGroup: (payload: GroupProposal) => boolean; // открыть диалог; true => событие "поглощено"
  pending: GroupProposal | null;
  closeDialog: () => void;
  chooseAbstract: () => void;
  chooseFlex: () => void;
  open: boolean;
  setHandlers: (handlers: {
    onAbstract: (p: GroupProposal) => void;
    onFlex: (p: GroupProposal) => void;
  }) => void;
};

const Ctx = createContext<GroupOnDropContextValue | null>(null);

export function useGroupOnDrop() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useGroupOnDrop must be used within GroupOnDropProvider");
  return ctx;
}

export const GroupOnDropProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const hoveredRootIdRef = useRef<number | null>(null); // <— Ref для хранения текущего hovered root ID (не вызывает ререндер)
  const [pending, setPending] = useState<GroupProposal | null>(null);
  const [open, setOpen] = useState(false);

  const handlersRef = useRef<{
    onAbstract?: (p: GroupProposal) => void;
    onFlex?: (p: GroupProposal) => void;
  }>({});

  const setHoveredRootId = useCallback((id: number | null) => {
    hoveredRootIdRef.current = id; // <— Setter: обновляет ref (используется в TreeNode)
  }, []);

  const getHoveredRootId = useCallback(() => hoveredRootIdRef.current, []);

  const proposeGroup = useCallback((payload: GroupProposal) => {
    setPending(payload);
    setOpen(true); // <— Открывает диалог для выбора типа группы
    return true; // сигнализируем "не делать reorder: мы перехватили дроп"  // <— Возвращает true, чтобы handleMove знал, что drop "поглощен" группировкой
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setPending(null);
  }, []);

  const chooseAbstract = useCallback(() => {
    if (pending && handlersRef.current.onAbstract) {
      handlersRef.current.onAbstract(pending);
    }
    closeDialog();
  }, [pending, closeDialog]);

  const chooseFlex = useCallback(() => {
    if (pending && handlersRef.current.onFlex) {
      handlersRef.current.onFlex(pending);
    }
    closeDialog();
  }, [pending, closeDialog]);

  const setHandlers = useCallback(
    (h: {
      onAbstract: (p: GroupProposal) => void;
      onFlex: (p: GroupProposal) => void;
    }) => {
      handlersRef.current = h;
    },
    []
  );

  const value = useMemo(
    (): GroupOnDropContextValue => ({
      setHoveredRootId,
      getHoveredRootId,
      proposeGroup,
      pending,
      closeDialog,
      chooseAbstract,
      chooseFlex,
      open,
      setHandlers,
    }),
    [
      getHoveredRootId,
      proposeGroup,
      pending,
      closeDialog,
      chooseAbstract,
      chooseFlex,
      open,
      setHandlers,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
