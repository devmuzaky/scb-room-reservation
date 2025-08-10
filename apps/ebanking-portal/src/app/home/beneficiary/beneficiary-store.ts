import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { BankOfBeneficiary } from './models/models';

export type BeneficiaryInterface = {
  bankOfBeneficiaryList: BankOfBeneficiary[];
};

export const initialBeneficiaryState: BeneficiaryInterface = {
  bankOfBeneficiaryList: [],
};

export const BeneficiaryStore = signalStore(
  { providedIn: 'root' },
  withState(initialBeneficiaryState),
  withMethods(store => ({
    setBankOfBeneficiaryList(bankOfBeneficiaryList: BankOfBeneficiary[]) {
      patchState(store, () => ({ bankOfBeneficiaryList }));
    },
  })),
);
