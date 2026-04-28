export interface Phase {
  id: string;
  title: string;
  result?: string;
  color?: string;
}

export interface Stage {
  id: string;
  title: string;
  result?: string;
  color?: string;
}

export interface Area {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

export interface Module {
  id: string;
  name: string;
  color: string;
}

export interface Role {
  id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: number | string;
  text: string;
  completed: boolean;
}

export interface ProjectCard {
  id: string | number;
  title: string;
  phase: string[];
  stage: string[];
  area: string[];
  modules: string[];
  roles: string[];
  desc: string;
  link: string;
  checklist: ChecklistItem[];
}
