// TODO: Define proper interfaces for the frontend application

export const MOCK_TIME_DEPOSITS_RESPONSE = {
  totalBalance: {
    amount: 250000.0,
    currency: 'EGP',
    isEquivalent: true,
  },
  timestamp: '2025-02-10T11:53:00Z',
  pagination: {
    page: 0,
    size: 10,
    totalPages: 3,
    totalElements: 25,
  },
  deposits: [
    {
      tdNumber: 'TD0001',
      tdType: 'Term Deposit',
      amount: 50000.123456,
      currency: 'USD',
      interestRate: 5.0,
      maturityDate: '2025-03-30',
      tenor: '12 Months',
    },
    {
      tdNumber: 'TD0002',
      tdType: 'Term Deposit',
      amount: 75000.0,
      currency: 'USD',
      interestRate: 4.75,
      maturityDate: '2025-04-05',
      tenor: '6 Months',
    },
  ],
};
