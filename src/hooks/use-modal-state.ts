const useModalState = <T extends string>(keyList: T[]) => {
  const [modal, setModal] = useState(
    reduce(
      keyList,
      (acc, key) => {
        acc[key] = { load: false, open: false };
        return acc;
      },
      {} as Record<T, { load: boolean; open: boolean }>,
    ),
  );

  const openModal = (name: T): void => {
    setModal((pre) => ({ ...pre, [name]: { load: true, open: true } }));
  };

  const closeModal = (name: T) => {
    return (isDestroy = false): void => {
      setModal((pre) => ({
        ...pre,
        [name]: { load: !isDestroy, open: false },
      }));
    };
  };

  return { modal, openModal, closeModal };
};

export default useModalState;
