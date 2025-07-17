import { getSchema } from "@/api/product";
import type { SetState, Actions, State } from "./types";

const { setSessionStorage } = useStorage();

const createAction = (set: SetState<State>): Actions => ({
  changeLanguage: (lang: string): void => {
    set(() => ({ locale: lang }));
    setSessionStorage("language", lang);
  },
  getSchema: async (): Promise<void> => {
    const response = await getSchema();
    set(() => ({ schema: response }));
  },
});

export default createAction;
