const useUser = () => {
  const { getUserInfo } = useCookie();
  const [user, setUser] = useState<Auth.User>(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  return { userInfo: user };
};

export default useUser;
