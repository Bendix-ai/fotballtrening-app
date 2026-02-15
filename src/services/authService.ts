import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Club, Team } from '../types';

function buildSyntheticEmail(username: string, teamId: string): string {
    const cleanUser = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const shortTeam = teamId.replace(/-/g, '').substring(0, 8);
    return `${cleanUser}.${shortTeam}@fotballtrening.app`;
}

export async function signUpPlayer(
    username: string,
    password: string,
    clubId: string,
    teamId: string,
    displayName: string
) {
    const email = buildSyntheticEmail(username, teamId);
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
                role: 'player',
                club_id: clubId,
                team_id: teamId,
                display_name: displayName,
            },
        },
    });
    if (error) throw error;
    return data;
}

export async function signUpClubAdmin(
    email: string,
    password: string,
    clubId: string,
    displayName: string
) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: email,
                role: 'admin',
                admin_type: 'club_admin',
                club_id: clubId,
                display_name: displayName,
            },
        },
    });
    if (error) throw error;
    return data;
}

export async function signUpTeamAdmin(
    email: string,
    password: string,
    clubId: string,
    displayName: string,
    managedTeamIds: string[]
) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: email,
                role: 'admin',
                admin_type: 'team_admin',
                club_id: clubId,
                display_name: displayName,
                managed_team_ids: managedTeamIds,
            },
        },
    });
    if (error) throw error;
    return data;
}

export async function createClub(clubName: string): Promise<string> {
    const { data, error } = await supabase.rpc('create_club', {
        p_club_name: clubName,
    });
    if (error) throw error;
    return data as string;
}

export async function loginPlayer(
    username: string,
    password: string,
    teamId: string
) {
    const email = buildSyntheticEmail(username, teamId);
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function loginAdmin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
}

export async function updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
}

export async function adminResetPlayerPassword(playerId: string, newPassword: string): Promise<void> {
    const { error } = await supabase.rpc('reset_player_password', {
        p_player_id: playerId,
        p_new_password: newPassword,
    });
    if (error) throw error;
}

export interface ProfileWithRelations {
    user: User;
    club: Club | null;
    team: Team | null;
    managedTeamIds: string[];
}

export async function getProfile(userId: string): Promise<ProfileWithRelations | null> {
    // Try with admin_team_assignments join first
    let { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            clubs:club_id (*),
            teams:team_id (*),
            admin_team_assignments (team_id)
        `)
        .eq('id', userId)
        .single();

    // If the join fails (e.g. table not yet created), retry without it
    if (error) {
        console.error('getProfile error (with join):', error.message);
        const fallback = await supabase
            .from('profiles')
            .select(`
                *,
                clubs:club_id (*),
                teams:team_id (*)
            `)
            .eq('id', userId)
            .single();
        data = fallback.data;
        error = fallback.error;
    }

    if (error || !data) {
        console.error('getProfile error:', error?.message);
        return null;
    }

    const user: User = {
        id: data.id,
        username: data.username,
        role: data.role,
        admin_type: data.admin_type ?? null,
        club_id: data.club_id,
        team_id: data.team_id,
        display_name: data.display_name,
        avatar_url: data.avatar_url,
        total_points: data.total_points,
        current_streak: data.current_streak,
        longest_streak: data.longest_streak,
        created_at: data.created_at,
        last_login: data.last_login,
    };

    const managedTeamIds: string[] = (data.admin_team_assignments || [])
        .map((a: any) => a.team_id);

    const club: Club | null = data.clubs ? {
        id: data.clubs.id,
        name: data.clubs.name,
        logo_url: data.clubs.logo_url,
        created_by: data.clubs.created_by,
        created_at: data.clubs.created_at,
    } : null;

    const team: Team | null = data.teams ? {
        id: data.teams.id,
        year_group_id: data.teams.year_group_id,
        gender: data.teams.gender,
        name: data.teams.name,
        created_at: data.teams.created_at,
    } : null;

    return { user, club, team, managedTeamIds };
}
