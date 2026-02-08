import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Club, YearGroup, Team, ClubYearGroup, Gender } from '../types';
import { mockClubs, mockYearGroups, mockGenders, mockClubStructure } from '../data/mockData';

export async function getClubs(): Promise<Club[]> {
    if (!isSupabaseConfigured()) return mockClubs;

    const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name');

    if (error) {
        console.error('getClubs error:', error);
        return mockClubs;
    }
    return data as Club[];
}

export async function getYearGroups(clubId: string): Promise<{ value: string; label: string }[]> {
    if (!isSupabaseConfigured()) return mockYearGroups;

    const { data, error } = await supabase
        .from('year_groups')
        .select('id, year')
        .eq('club_id', clubId)
        .order('year', { ascending: false });

    if (error) {
        console.error('getYearGroups error:', error);
        return mockYearGroups;
    }
    return data.map(yg => ({ value: yg.id, label: String(yg.year) }));
}

export async function getTeams(yearGroupId: string): Promise<{ value: Gender; label: string; teamId: string }[]> {
    if (!isSupabaseConfigured()) {
        return mockGenders.map(g => ({ ...g, teamId: 'mock' }));
    }

    const { data, error } = await supabase
        .from('teams')
        .select('id, gender, name')
        .eq('year_group_id', yearGroupId)
        .order('gender');

    if (error) {
        console.error('getTeams error:', error);
        return mockGenders.map(g => ({ ...g, teamId: 'mock' }));
    }

    const genderLabels: Record<string, string> = {
        boys: 'Gutter',
        girls: 'Jenter',
        mixed: 'Blandet',
    };

    return data.map(t => ({
        value: t.gender as Gender,
        label: genderLabels[t.gender] || t.name,
        teamId: t.id,
    }));
}

export async function getClubStructure(clubId: string): Promise<ClubYearGroup[]> {
    if (!isSupabaseConfigured()) return mockClubStructure;

    const { data, error } = await supabase.rpc('get_club_structure', {
        p_club_id: clubId,
    });

    if (error) {
        console.error('getClubStructure error:', error);
        return mockClubStructure;
    }
    return data as ClubYearGroup[];
}

export async function getAllTeamsForClub(clubId: string): Promise<{
    id: string;
    name: string;
    year: number;
    gender: Gender;
}[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
        .from('teams')
        .select(`
            id, name, gender,
            year_groups!inner (year, club_id)
        `)
        .eq('year_groups.club_id', clubId);

    if (error) {
        console.error('getAllTeamsForClub error:', error);
        return [];
    }

    return (data as any[])
        .map(t => ({
            id: t.id,
            name: t.name,
            year: t.year_groups.year as number,
            gender: t.gender as Gender,
        }))
        .sort((a, b) => b.year - a.year || a.gender.localeCompare(b.gender));
}

export async function addYearGroup(clubId: string, year: number): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    const { data: yg, error: ygError } = await supabase
        .from('year_groups')
        .insert({ club_id: clubId, year })
        .select()
        .single();

    if (ygError) {
        console.error('addYearGroup error:', ygError);
        return false;
    }

    // Auto-create boys and girls teams
    const { error: teamsError } = await supabase
        .from('teams')
        .insert([
            { year_group_id: yg.id, gender: 'boys', name: `Gutter ${year}` },
            { year_group_id: yg.id, gender: 'girls', name: `Jenter ${year}` },
        ]);

    if (teamsError) {
        console.error('addYearGroup teams error:', teamsError);
    }

    return true;
}
