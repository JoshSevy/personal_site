export interface SyntaxChallenge {
  id: string;
  language: string;
  question: string;
  code: string;
  choices: string[];
  correct_index: number;
  explanation: string | null;
  source: string;
  is_published: boolean;
  created_by?: string | null;
  created_at?: string;
}
