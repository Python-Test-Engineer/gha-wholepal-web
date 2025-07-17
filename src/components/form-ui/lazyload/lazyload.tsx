import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const renderFallback = (fallback: boolean, loader?: ReactNode): ReactNode => {
  const preloader = loader || (
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  );
  if (fallback) {
    return preloader;
  }
  return <></>;
};

const lazyloadComponent = <T extends object>(
  component: () => Promise<{ default: ComponentType<T> }>,
  fallback?: boolean,
  loader?: ReactNode
) => {
  const LazyComponent = lazy(component);

  return (
    props: ComponentProps<typeof LazyComponent> & React.JSX.IntrinsicAttributes
  ) => (
    <Suspense fallback={renderFallback(fallback, loader)}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export function lazyload<T extends object>(
  component: () => Promise<{ default: ComponentType<T> }>
) {
  return lazyloadComponent(component);
}

export function lazyloadWithLoader<T extends object>(
  component: () => Promise<{ default: ComponentType<T> }>,
  loader?: ReactNode
) {
  return lazyloadComponent(component, true, loader);
}
