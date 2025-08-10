import { AccountList } from '../types/dashboard.types';

export function generateAccountRecords(count: number): AccountList[] {
  const accounts: AccountList[] = [];
  const accountTypes = ['Checking', 'Savings', 'Credit', 'Investment'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];

  for (let i = 0; i < count; i++) {
    const accountNumber = `ACC-${Math.floor(Math.random() * 1000000)}`;
    const accountNickName = `Account ${i + 1}`;
    const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
    const availableBalance = parseFloat((Math.random() * 10000).toFixed(2));
    const currency = currencies[Math.floor(Math.random() * currencies.length)];

    accounts.push({
      accountNumber,
      accountNickName,
      accountType,
      availableBalance,
      currency,
    });
  }

  return accounts;
}
