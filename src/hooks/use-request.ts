export const useRequest = <T>(
  options: UseQueryOptions<T>,
): UseQueryResult<T> & { removeQueries?: () => void } => {
  const queryClient = useQueryClient();
  const initialData: T = queryClient.getQueryData(options.queryKey);
  const removeQueries = () =>
    queryClient.removeQueries({ queryKey: options.queryKey });
  const queryResult = useQuery({
    ...options,
    initialData,
  });

  return {
    ...queryResult,
    removeQueries,
  };
};

export const useInfiniteRequest = <T>(
  options: UseInfiniteQueryOptions<T>,
): UseInfiniteQueryResult<T> & { removeQueries?: () => void } => {
  const queryClient = useQueryClient();
  const removeQueries = () =>
    queryClient.removeQueries({ queryKey: options.queryKey });
  const queryResult = useInfiniteQuery(options);

  return {
    ...queryResult,
    removeQueries,
  };
};

export const useMultipleRequests = <T extends Array<UseQueryOptions>>(
  queriesOptions: readonly [...QueriesOptions<T>],
): QueriesResults<T> => {
  const queryClient = useQueryClient();
  forEach(queriesOptions, (queryOptions) => ({
    ...queryOptions,
    initialData: queryClient.getQueryData(queryOptions.queryKey),
  }));

  return useQueries({ queries: queriesOptions });
};
