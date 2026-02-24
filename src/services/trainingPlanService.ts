import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TrainingPlan, TrainingPlanDay } from '../types';
import { mockTrainingPlan, mockTrainingPlanDays } from '../data/mockData';

/**
 * Get the Monday (ISO date string) of the current week.
 */
function getCurrentWeekMonday(): string {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    return monday.toISOString().split('T')[0];
}

/**
 * Get the active training plan for the current week.
 */
export async function getActivePlan(
    clubId: string,
    teamId?: string | null
): Promise<{ plan: TrainingPlan; days: TrainingPlanDay[] } | null> {
    if (!isSupabaseConfigured()) {
        return { plan: mockTrainingPlan, days: mockTrainingPlanDays };
    }

    const weekStart = getCurrentWeekMonday();

    let query = supabase
        .from('training_plans')
        .select('*')
        .eq('club_id', clubId)
        .eq('week_start', weekStart);

    if (teamId) {
        query = query.eq('team_id', teamId);
    } else {
        query = query.is('team_id', null);
    }

    const { data: plans, error } = await query.limit(1);

    if (error || !plans || plans.length === 0) {
        if (error) console.error('getActivePlan error:', error);
        return { plan: mockTrainingPlan, days: mockTrainingPlanDays };
    }

    const plan = plans[0] as TrainingPlan;

    const { data: days, error: daysError } = await supabase
        .from('training_plan_days')
        .select('*')
        .eq('plan_id', plan.id)
        .order('day_of_week', { ascending: true });

    if (daysError) {
        console.error('getActivePlan days error:', daysError);
        return { plan, days: [] };
    }

    return {
        plan,
        days: (days ?? []) as TrainingPlanDay[],
    };
}

/**
 * Create a new training plan for the current week.
 */
export async function createPlan(
    clubId: string,
    createdBy: string,
    days: Omit<TrainingPlanDay, 'id' | 'plan_id'>[],
    teamId?: string | null
): Promise<{ plan: TrainingPlan; days: TrainingPlanDay[] }> {
    const weekStart = getCurrentWeekMonday();

    if (!isSupabaseConfigured()) {
        const newPlan: TrainingPlan = {
            id: String(Date.now()),
            club_id: clubId,
            team_id: teamId ?? null,
            week_start: weekStart,
            created_by: createdBy,
            created_at: new Date().toISOString(),
        };
        const newDays: TrainingPlanDay[] = days.map((d, i) => ({
            id: `tpd-${Date.now()}-${i}`,
            plan_id: newPlan.id,
            day_of_week: d.day_of_week,
            exercise_ids: d.exercise_ids,
        }));
        return { plan: newPlan, days: newDays };
    }

    const { data: planRow, error: planError } = await supabase
        .from('training_plans')
        .insert({
            club_id: clubId,
            team_id: teamId ?? null,
            week_start: weekStart,
            created_by: createdBy,
        })
        .select()
        .single();

    if (planError || !planRow) {
        console.error('createPlan error:', planError);
        throw new Error('Failed to create training plan');
    }

    const plan = planRow as TrainingPlan;

    if (days.length > 0) {
        const dayRows = days.map((d) => ({
            plan_id: plan.id,
            day_of_week: d.day_of_week,
            exercise_ids: d.exercise_ids,
        }));

        const { error: daysError } = await supabase
            .from('training_plan_days')
            .insert(dayRows);

        if (daysError) {
            console.error('createPlan days error:', daysError);
        }
    }

    // Fetch back the days
    const { data: savedDays } = await supabase
        .from('training_plan_days')
        .select('*')
        .eq('plan_id', plan.id)
        .order('day_of_week', { ascending: true });

    return { plan, days: (savedDays ?? []) as TrainingPlanDay[] };
}

/**
 * Update an existing training plan's days.
 */
export async function updatePlan(
    planId: string,
    days: Omit<TrainingPlanDay, 'id' | 'plan_id'>[]
): Promise<TrainingPlanDay[]> {
    if (!isSupabaseConfigured()) {
        return days.map((d, i) => ({
            id: `tpd-${Date.now()}-${i}`,
            plan_id: planId,
            day_of_week: d.day_of_week,
            exercise_ids: d.exercise_ids,
        }));
    }

    // Delete existing days and re-insert
    const { error: deleteError } = await supabase
        .from('training_plan_days')
        .delete()
        .eq('plan_id', planId);

    if (deleteError) {
        console.error('updatePlan delete error:', deleteError);
    }

    if (days.length > 0) {
        const dayRows = days.map((d) => ({
            plan_id: planId,
            day_of_week: d.day_of_week,
            exercise_ids: d.exercise_ids,
        }));

        const { error: insertError } = await supabase
            .from('training_plan_days')
            .insert(dayRows);

        if (insertError) {
            console.error('updatePlan insert error:', insertError);
        }
    }

    const { data: savedDays } = await supabase
        .from('training_plan_days')
        .select('*')
        .eq('plan_id', planId)
        .order('day_of_week', { ascending: true });

    return (savedDays ?? []) as TrainingPlanDay[];
}
