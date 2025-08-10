import { ChequeOutResponse } from '../../home/dashboard/widgets/cheque-out/model';

export const DEDUCTED_MOCK = [
  {
    chequeSerialNumber: '16000006924',
    chequeValue: '1000000.00',
    debitAccountNumber: '1630003810100101',
    currency: 'EGP',
    date: 1740388890531,
  },
  {
    chequeSerialNumber: '16000006924',
    chequeValue: '950345.67',
    debitAccountNumber: '1630003810100101',
    currency: 'EGP',
    date: 1740388890531,
  },
  {
    chequeSerialNumber: '16000006925',
    chequeValue: '1123456.78',
    debitAccountNumber: '1630003810100102',
    currency: 'EGP',
    date: 1740397530000,
  },
  {
    chequeSerialNumber: '16000006926',
    chequeValue: '876543.21',
    debitAccountNumber: '1630003810100103',
    currency: 'EGP',
    date: 1740406170000,
  },
];

export const RETURNED_MOCK = [
  {
    chequeSerialNumber: '16000006924',
    chequeValue: '1000000.00',
    debitAccountNumber: '1630003810100101',
    currency: 'EGP',
    date: 1740388890531,
  },
  {
    chequeSerialNumber: '16000006927',
    chequeValue: '1054321.98',
    debitAccountNumber: '1630003810100104',
    currency: 'EGP',
    date: 1740414810000,
  },
  {
    chequeSerialNumber: '16000006928',
    chequeValue: '987654.32',
    debitAccountNumber: '1630003810100105',
    currency: 'EGP',
    date: 1740423450000,
  },
  {
    chequeSerialNumber: '16000006929',
    chequeValue: '1012345.67',
    debitAccountNumber: '1630003810100106',
    currency: 'EGP',
    date: 1740432090000,
  },
  {
    chequeSerialNumber: '16000006930',
    chequeValue: '999999.99',
    debitAccountNumber: '1630003810100107',
    currency: 'EGP',
    date: 1740440730000,
  },
  {
    chequeSerialNumber: '16000006931',
    chequeValue: '1000000.01',
    debitAccountNumber: '1630003810100108',
    currency: 'EGP',
    date: 1740449370000,
  },
  {
    chequeSerialNumber: '16000006932',
    chequeValue: '1150000.00',
    debitAccountNumber: '1630003810100109',
    currency: 'EGP',
    date: 1740458010000,
  },
  {
    chequeSerialNumber: '16000006933',
    chequeValue: '850000.00',
    debitAccountNumber: '1630003810100110',
    currency: 'EGP',
    date: 1740466650000,
  },
];
export const CHEQUE_OUT_MOCK = {
  lastUpdatedTimestamp: 1740388890531,
  deductedCheques: DEDUCTED_MOCK,
  returnedCheques: RETURNED_MOCK,
} satisfies ChequeOutResponse;

export const CHEQUE_OUT_EMPTY_DEDUCTED_MOCK = {
  lastUpdatedTimestamp: 1740388890531,
  deductedCheques: [],
  returnedCheques: [],
} satisfies ChequeOutResponse;
