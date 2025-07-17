import { toast } from "react-hot-toast";
import { getWholesalerProducts } from "@/api/product";

const useWholesalerProductList = (searchQuery: string, isTable: boolean) => {
  const [pagination, setPagination] = useState<App.Pagination>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  const productListQuery = useRequest({
    queryKey: [
      "get-wholesaler-product-list",
      {
        searchQuery,
        currentPage: pagination.currentPage,
        perPage: pagination.perPage,
      },
    ],
    queryFn: () =>
      getWholesalerProducts({
        keyword: searchQuery,
        page: pagination.currentPage,
        limit: pagination.perPage,
      }),
    enabled: isTable,
  });

  useEffect(() => {
    if (productListQuery.isSuccess && !productListQuery.isRefetching) {
      const {
        meta: { totalItems, itemsPerPage, currentPage },
      } = productListQuery.data;
      setPagination({ total: totalItems, perPage: itemsPerPage, currentPage });
    }
  }, [productListQuery.isSuccess, productListQuery.isRefetching]);

  useEffect(() => {
    if (productListQuery.isError) {
      toast.error(productListQuery.error.message);
    }
  }, [productListQuery.isError]);

  const onChangePage = (currentPage: number): void =>
    setPagination((prev) => ({ ...prev, currentPage }));

  const productInfinityListQuery = useInfiniteRequest({
    queryKey: ["get-infinite-wholesaler-products", { searchQuery }],
    queryFn: ({ pageParam }) =>
      getWholesalerProducts({
        page: pageParam as number,
        limit: 12,
        keyword: searchQuery,
      }),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) =>
      meta.currentPage < meta.totalPages ? meta.currentPage + 1 : null,
    enabled: !isTable,
  });

  useEffect(() => {
    if (productInfinityListQuery.isError) {
      toast.error(productInfinityListQuery.error.message);
    }
  }, [productInfinityListQuery.isError]);

  return {
    productListQuery,
    productInfinityListQuery,
    pagination,
    onChangePage,
  };
};

export default useWholesalerProductList;
