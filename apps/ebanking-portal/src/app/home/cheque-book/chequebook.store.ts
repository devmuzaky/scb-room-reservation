import { inject } from '@angular/core';
import { ChequeBookInfo } from '@/home/cheque-book/chequebook.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { StorageService } from '@scb/util/storage';

const STORAGE_KEY = 'chequeBookDetail';

export type LayoutInterface = {
  chequeBookDetail?: ChequeBookInfo;
};

export const initialState: LayoutInterface = {
  chequeBookDetail: undefined as ChequeBookInfo | undefined,
};

export const ChequeBookStore = signalStore(
  // provide the store in root service
  { providedIn: 'root' },
  withState(() => {
    const storage = inject(StorageService<ChequeBookInfo>);
    const storedDetail = storage.get(STORAGE_KEY);
    return {
      chequeBookDetail: storedDetail ?? undefined,
    };
  }),
  withMethods(store => {
    const storage = inject(StorageService<ChequeBookInfo>);

    return {
      setChequeBookDetail(chequeBookDetail: ChequeBookInfo) {
        storage.set(STORAGE_KEY, chequeBookDetail);
        patchState(store, () => ({ chequeBookDetail }));
      },
      clearChequeBookDetail() {
        storage.delete(STORAGE_KEY);
        patchState(store, () => ({ chequeBookDetail: undefined }));
      },
    };
  }),
);
