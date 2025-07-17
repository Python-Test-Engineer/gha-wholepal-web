import { toast } from "react-hot-toast";
import { getProducts } from "@/api/product";

const useProductList = (searchQuery: string, isTable: boolean) => {
  const [pagination, setPagination] = useState<App.Pagination>({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
  });

  const productListQuery = useRequest({
    queryKey: [
      "getProducts",
      {
        searchQuery,
        currentPage: pagination.currentPage,
        perPage: pagination.perPage,
      },
    ],
    queryFn: () =>
      getProducts({
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
    queryKey: ["get-infinite-products", { searchQuery }],
    queryFn: ({ pageParam }) =>
      getProducts({
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

export default useProductList;
