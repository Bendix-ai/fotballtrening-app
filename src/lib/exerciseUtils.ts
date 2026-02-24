import { MaterialIcons } from '@expo/vector-icons';

/**
 * Returns the MaterialIcons icon name for an exercise category.
 */
export function getCategoryIcon(category: string): keyof typeof MaterialIcons.glyphMap {
    switch (category) {
        case 'warmup': return 'directions-run';
        case 'strength': return 'fitness-center';
        case 'agility': return 'speed';
        case 'skill': return 'sports-soccer';
        case 'cooldown': return 'self-improvement';
        default: return 'sports-soccer';
    }
}

/**
 * Returns a hex color for an exercise category (used for icon backgrounds).
 */
export function getCategoryColor(category: string): string {
    switch (category) {
        case 'warmup': return '#FF9800';
        case 'strength': return '#F44336';
        case 'agility': return '#2196F3';
        case 'skill': return '#4CAF50';
        case 'cooldown': return '#9C27B0';
        default: return '#607D8B';
    }
}
