declare namespace App {
  type ErrorValue = {
    children?: Record<string, ErrorValue>;
    messages: string[];
  };

  type ResponseError = {
    message: string;
    errors: Record<string, ErrorValue>;
    status?: number;
  };

  type MessageError = ResponseError["errors"];

  type SelectItem = {
    value: string;
    label: string;
    disabled?: boolean;
  };

  type SelectValue = string | string[] | number | number[];

  type DateTime = Dayjs | number | string;

  type WithSelectors<S> = S extends { getState: () => infer T }
    ? S & { use: { [K in keyof T]: () => T[K] } }
    : never;

  interface Entity {
    id?: string;
    createdAt?: number;
    updatedAt?: number;
  }

  interface PaginationConfig {
    currentPage: number;
    perPage: number;
    total?: number;
    onChangePage: (page: number) => void;
  }

  interface Pagination {
    currentPage: number;
    perPage: number;
    total?: number;
    lastPage?: number;
  }

  interface ScrollValue {
    clientHeight: number;
    clientWidth: number;
    left: number;
    scrollHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    top: number;
  }

  type ListItem<T> = {
    items: T[];
    meta: {
      currentPage: number;
      itemCount: number;
      itemsPerPage: number;
      totalItems: number;
      totalPages: number;
    };
  };

  interface ListItemRequestParams {
    page?: number;
    limit?: number;
  }

  type LayoutComponent<T> = {
    children?: T;
  };

  interface DownloadFileData {
    url: string;
    fileName?: string;
  }
}
