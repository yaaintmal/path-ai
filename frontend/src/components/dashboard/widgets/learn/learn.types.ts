export interface SubTopic {
  id: string;
  title: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface StartingPoint {
  id: string;
  title: string;
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
