import { BudgetRequest, EventView } from '../types/event-models';
import { Account, Transaction } from '../types/finantial-models';
import { Inventory, Product } from '../types/inventory-models';
import { Subscriber, SubscriptionPlan } from '../types/subscription-models';
import { Supplier } from '../types/supplier-models';

export const budgetRequestFilterByEventName = (
  requests: BudgetRequest[],
  eventName: string
): BudgetRequest[] => {
  if (!eventName) return requests;
  return requests.filter((request) =>
    request.eventName.toLowerCase().includes(eventName.toLowerCase())
  );
};

export const accountFilterByName = (
  accounts: Account[],
  name: string
): Account[] => {
  if (!name) return accounts;
  return accounts.filter((account) =>
    account.accountName.toLowerCase().includes(name.toLowerCase())
  );
};

export const transactionFilterByType = (
  transactions: Transaction[],
  type: string
): Transaction[] => {
  if (!type) return transactions;
  return transactions.filter((transaction) =>
    transaction.transactionType.toLowerCase().includes(type.toLowerCase())
  );
};

export const productsFilterByName = (
  products: Product[],
  name: string
): Product[] => {
  if (!name) return products;
  return products.filter((product) =>
    product.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const inventoriesFilterByProduct = (
  inventories: Inventory[],
  product: string
): Inventory[] => {
  if (!product) return inventories;
  return inventories.filter((inventory) =>
    inventory.product.toLowerCase().includes(product.toLowerCase())
  );
};

export const suppliersFilterByName = (
  suppliers: Supplier[],
  name: string
): Supplier[] => {
  if (!name) return suppliers;
  return suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const eventsFilterByName = (
  events: EventView[],
  name: string
): EventView[] => {
  if (!name) return events;
  return events.filter((event) =>
    event.title.toLowerCase().includes(name.toLowerCase())
  );
};

export const subscriptionPlanFilterByName = (
  plans: SubscriptionPlan[],
  name: string
): SubscriptionPlan[] => {
  if (!name) return plans;
  return plans.filter((plan) =>
    plan.planName.toLowerCase().includes(name.toLowerCase())
  );
};

export const subscribersFilterByName = (
  subscribers: Subscriber[],
  name: string
): Subscriber[] => {
  if (!name) return subscribers;
  return subscribers.filter((subscriber) =>
    subscriber.name.toLowerCase().includes(name.toLowerCase())
  );
};
