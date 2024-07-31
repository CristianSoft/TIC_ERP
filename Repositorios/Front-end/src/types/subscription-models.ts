export interface Subscriber {
  id?: number;
  state_id?: number;
  date: string;
  name: string;
  faculty: string;
  career: string;
  email: string;
  plan: string;
  price?: number;
  academicPeriod?: string;
}

export interface SubscriptionPlan {
  id?: number;
  state_id?: number;
  planName: string;
  price: number;
  benefits: string;
  academicPeriod: string;
}
