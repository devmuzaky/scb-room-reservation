import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type SoftTokenState = {
  activationCode: string;
  qrCode: string;
  qrCodeLink: string;
  serialNumber: string;
};

export const initialSoftTokenState: SoftTokenState = {
  activationCode: '',
  qrCode: '',
  qrCodeLink: '',
  serialNumber: '',
};

export const SoftTokenStore = signalStore(
  // provide the store in root service
  { providedIn: 'root' },
  withState(initialSoftTokenState),
  withMethods(store => ({
    setActivationCode(activationCode: string) {
      patchState(store, () => ({ activationCode }));
    },
    setQrCode(qrCode: string) {
      patchState(store, () => ({ qrCode }));
    },
    setQrCodeLink(qrCodeLink: string) {
      patchState(store, () => ({ qrCodeLink }));
    },
    setSerialNumber(serialNumber: string) {
      patchState(store, () => ({ serialNumber }));
    },
    reset() {
      patchState(store, () => initialSoftTokenState);
    },
  })),
);
