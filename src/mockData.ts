import type { Phase, Area, Module, Role, ProjectCard } from './types';

export const mockPhases: Phase[] = [
  { id: 'p1', title: 'Planning', color: '#3b82f6' },
  { id: 'p2', title: 'Execution', color: '#10b981' },
  { id: 'p3', title: 'Review', color: '#f59e0b' },
];

export const mockAreas: Area[] = [
  { id: 'a1', title: 'Frontend', color: '#6366f1' },
  { id: 'a2', title: 'Backend', color: '#8b5cf6' },
  { id: 'a3', title: 'Design', color: '#ec4899' },
];

export const mockModules: Module[] = [
  { id: 'm1', title: 'Auth', color: '#ef4444' },
  { id: 'm2', title: 'Dashboard', color: '#14b8a6' },
];

export const mockRoles: Role[] = [
  { id: 'r1', title: 'Developer', color: '#3b82f6' },
  { id: 'r2', title: 'Designer', color: '#ec4899' },
];

export const mockCards: ProjectCard[] = [
  {
    id: 'c1',
    title: 'Setup Authentication',
    phase: ['p1'],
    area: ['a2'],
    modules: ['m1'],
    roles: ['r1'],
    desc: 'Implement JWT based authentication',
    link: '#',
    checklist: [{ id: 'cl1', text: 'Create API', completed: false }]
  },
  {
    id: 'c2',
    title: 'Design System',
    phase: ['p1', 'p2'],
    area: ['a1', 'a3'],
    modules: ['m2'],
    roles: ['r1', 'r2'],
    desc: 'Create components based on Figma',
    link: '#',
    checklist: [{ id: 'cl2', text: 'Buttons', completed: true }]
  }
];
