import { TransferDataResponse } from '../models/transfers.models';

export const TRANSFER_DATA_AR = {
  chargeBearer: [
    {
      key: 'SENDER',
      value: 'الراسل',
    },
    {
      key: 'BENEFICIARY',
      value: 'المستفيد',
    },
  ],
  transferStatus: [
    {
      key: 'NOT_STARTED',
      value: 'لم تبدأ',
    },
    {
      key: 'PENDING',
      value: 'جاري التنفيذ',
    },
    {
      key: 'SUCCESS',
      value: 'تم التنفيذ',
    },
    {
      key: 'FAILED',
      value: 'فشل في التنفيذ',
    },
    {
      key: 'CANCELLED',
      value: 'ملغي',
    },
    {
      key: 'REVERSED',
      value: 'مسترجع',
    },
  ],
  frequencyType: [
    {
      key: 'ONCE',
      value: 'مرة واحدة',
    },
    {
      key: 'DAILY',
      value: 'يومياً',
    },
    {
      key: 'WEEKLY',
      value: 'اسبوعياً',
    },
    {
      key: 'MONTHLY',
      value: 'شهرياً',
    },
    {
      key: 'QUARTERLY',
      value: 'ربع سنوي',
    },
    {
      key: 'SEMI_ANNUALLY',
      value: 'نصف سنوي',
    },
    {
      key: 'ANNUALLY',
      value: 'سنوياً',
    },
  ],
  transferType: [
    {
      key: 'OWN',
      value: 'تحويل بين حساباتك',
    },
    {
      key: 'INSIDE',
      value: 'داخل بنك قناة السويس',
    },
    {
      key: 'OUTSIDE',
      value: 'محلي خارج بنك قناة السويس',
    },
    {
      key: 'CHARITY',
      value: 'التحويلات الخيرية',
    },
  ],
  transferNetwork: [
    {
      key: 'ACH',
      value: 'تحويل ACH',
    },
    {
      key: 'IPN',
      value: 'تحويل لحظي',
    },
    {
      key: 'INTERNAL',
      value: 'تحويل داخلي',
    },
  ],
} satisfies TransferDataResponse;

export const TRANSFER_DATA_EN = {
  chargeBearer: [
    {
      key: 'SENDER',
      value: 'Sender',
    },
    {
      key: 'BENEFICIARY',
      value: 'Beneficiary',
    },
  ],
  transferStatus: [
    {
      key: 'NOT_STARTED',
      value: 'Not Started',
    },
    {
      key: 'PENDING',
      value: 'Pending',
    },
    {
      key: 'SUCCESS',
      value: 'Completed',
    },
    {
      key: 'FAILED',
      value: 'Failed',
    },
    {
      key: 'CANCELLED',
      value: 'Cancelled',
    },
    {
      key: 'REVERSED',
      value: 'Reversal',
    },
  ],
  frequencyType: [
    {
      key: 'ONCE',
      value: 'Once',
    },
    {
      key: 'DAILY',
      value: 'Daily',
    },
    {
      key: 'WEEKLY',
      value: 'Weekly',
    },
    {
      key: 'MONTHLY',
      value: 'Monthly',
    },
    {
      key: 'QUARTERLY',
      value: 'Quarterly',
    },
    {
      key: 'SEMI_ANNUALLY',
      value: 'Semi-annually',
    },
    {
      key: 'ANNUALLY',
      value: 'Annually',
    },
  ],
  transferType: [
    {
      key: 'OWN',
      value: 'Between Own Accounts',
    },
    {
      key: 'INSIDE',
      value: 'Inside SCB',
    },
    {
      key: 'OUTSIDE',
      value: 'Local Outside SCB',
    },
    {
      key: 'CHARITY',
      value: 'Donations',
    },
  ],
  transferNetwork: [
    {
      key: 'ACH',
      value: 'ACH transfer',
    },
    {
      key: 'IPN',
      value: 'Instant transfer',
    },
    {
      key: 'INTERNAL',
      value: 'Internal transfer',
    },
  ],
} satisfies TransferDataResponse;
