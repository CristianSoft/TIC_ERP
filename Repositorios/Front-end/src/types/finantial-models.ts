export interface Transaction {
  id?: number;
  date: string;
  originAccount: string;
  destinationAccount: string;
  value: number;
  transactionType: string;
  description: string;
}

export interface Account {
  /*id?: number;
  accountType: string;
  accountName: string;
  currentValue: number;
  date: string;*/
  id?: number;
  accountType: string;
  accountName: string;
  currentValue: number;
  date: string;
  initialBalance?: number;
  //accountingAccountStatus: string;
}
