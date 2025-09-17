export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
}

export interface BlogContent {
  title: string;
  introduction: string;
  sections: BlogSection[];
  conclusion: string;
  wordCount: number;
  topic: string;
  generatedAt: Date;
}

export interface GenerationOptions {
  wordCount: number;
  tone?: 'professional' | 'casual' | 'academic' | 'conversational';
  includeIntro?: boolean;
  includeConclusion?: boolean;
}