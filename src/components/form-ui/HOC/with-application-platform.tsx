import { useBoolean } from "ahooks";
import { Loader2 } from "lucide-react";
import useAppStore from "@/stores/app";
import useAuthStore from "@/stores/auth";

/**
 * A higher-order component that handles user authentication and data fetching.
 * @returns A function that takes a component and returns a new component with added functionality.
 */
export default () =>
  (WrappedComponent: ComponentType<App.LayoutComponent<ReactNode>>) =>
  (props: App.LayoutComponent<ReactNode>) => {
    const { isAuthenticated, getAccessToken } = useCookie();
    const { connect } = useSocket();
    const getSchema = useAppStore.use.getSchema();
    const getUserInfo = useAuthStore.use.getUserInfo();
    const [isLoading, { setTrue, setFalse }] = useBoolean(false);

    const getData = () => {
      setTrue();
      Promise.all([getUserInfo(), getSchema()])
        .then(([userInfo]) => {
          connect({ token: getAccessToken(), userId: userInfo.id });
        })
        .finally(() => setFalse());
    };

    useEffect(() => {
      if (isAuthenticated()) {
        getData();
      }
    }, []);

    if (isLoading) {
      return <Loader2 className="w-8 h-8 text-primary animate-spin" />;
    }

    return <WrappedComponent {...props} />;
  };
