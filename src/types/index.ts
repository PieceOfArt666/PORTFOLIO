export interface Project {
  id: string;
  title: string;
  genre: string;
  tagline: string;
  description: string;
  designRole: string;
  engine: string;
  languages: string[];
  features: string[];
  itchUrl?: string;
  githubUrl?: string;
  crayonUrl?: string;
  indieConnectUrl?: string;
  downloadUrl?: string;
  trailerUrl?: string;
  youtubeId?: string;
  screenshots?: string[];
  credits?: string;
  videoUrl?: string;
  imageUrl?: string;
  badge?: string;
  color: string;
}

export interface DesignPillar {
  title: string;
  tagline: string;
  description: string;
  iconName: string;
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: string;
    note: string;
  }[];
}
