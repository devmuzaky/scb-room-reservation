import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type CurrencyList = Record<'accounts' | 'certificates' | 'deposits', string[]>;

export interface DashboardState {
  currencyList: CurrencyList;
}

const initialState: DashboardState = {
  currencyList: {
    accounts: [],
    certificates: [],
    deposits: [],
  },
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(store => ({
    setCurrencyList(type: 'accounts' | 'certificates' | 'deposits', currencyList: string[]) {
      patchState(store, state => ({ currencyList: { ...state.currencyList, [type]: currencyList } }));
    },
  })),
);
