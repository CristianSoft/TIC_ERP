export interface EventView {
  id?: number;
  title: string;
  status: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  budgetStatus: string;
  location: string;
  income?: number;
}

export interface BudgetRequest {
  id?: number;
  eventName: string;
  requestStatusName: string; //EN REVISION, APROBADO, RECHAZADO
  reason: string;
  value: number;
}
