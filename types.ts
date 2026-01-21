export type ViewState = 
  | 'welcome' 
  | 'setup-goals' 
  | 'setup-personal' 
  | 'dashboard' 
  | 'weekly' 
  | 'diary' 
  | 'profile'
  | 'scanner';

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  avatar?: string;
}

export const INITIAL_USER: UserProfile = {
  name: "Alex Johnson",
  weight: 75,
  height: 178,
  age: 28,
  gender: 'male',
  goal: 'lose',
  activityLevel: 'lightly_active'
};