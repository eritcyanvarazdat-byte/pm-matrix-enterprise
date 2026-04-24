export interface Phase {
  id: string;
  title: string;
  color: string;
}

export interface Area {
  id: string;
  title: string;
  color: string;
}

export interface Module {
  id: string;
  title: string;
  color: string;
}

export interface Role {
  id: string;
  title: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ProjectCard {
  id: string;
  title: string;
  phase: string[];
  area: string[];
  modules: string[];
  roles: string[];
  desc: string;
  link: string;
  checklist: ChecklistItem[];
}
