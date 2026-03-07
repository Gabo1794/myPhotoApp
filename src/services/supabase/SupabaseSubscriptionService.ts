import type { ISubscriptionService, SubscriptionInfo } from '../interfaces/ISubscriptionService';
import type { PlanType } from '../../domain/types';
import supabase from '../../config/supabase';

export class SupabaseSubscriptionService implements ISubscriptionService {
  async getStatus(userId: string): Promise<SubscriptionInfo> {
    const { data, error } = await supabase
      .from('users')
      .select('id, subscription_status, plan_type, storage_limit_mb')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      userId: data.id,
      status: data.subscription_status,
      plan_type: data.plan_type,
      storage_limit_mb: data.storage_limit_mb,
    };
  }

  async updatePlan(userId: string, plan: PlanType): Promise<void> {
    const storageMapping: Record<PlanType, number> = {
      starter: 1024,
      professional: 10240,
      enterprise: 102400,
    };

    const { error } = await supabase
      .from('users')
      .update({
        plan_type: plan,
        storage_limit_mb: storageMapping[plan],
      })
      .eq('id', userId);

    if (error) throw error;
  }

  async cancelSubscription(userId: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
      })
      .eq('id', userId);

    if (error) throw error;
  }
}
