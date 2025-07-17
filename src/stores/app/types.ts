export interface State {
  locale: string;
  schema: ProductManagement.ProductCategory[];
}

export type Actions = {
  changeLanguage: (lang: string) => void;
  getSchema: () => Promise<void>;
};

export type SetState<T extends State> = {
  _(
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean | undefined,
    actionName?: string
  ): void;
}["_"];
