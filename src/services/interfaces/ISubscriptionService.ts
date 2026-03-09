import type { SubscriptionStatus, PlanType } from '../../domain/types';

export interface SubscriptionInfo {
  userId: string;
  status: SubscriptionStatus;
  plan_type: PlanType;
  storage_limit_mb: number;
}

export interface ISubscriptionService {
  getStatus(userId: string): Promise<SubscriptionInfo>;
  updatePlan(userId: string, plan: PlanType): Promise<void>;
  cancelSubscription(userId: string): Promise<void>;
}
