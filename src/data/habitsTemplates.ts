import { HabitCategory } from '../types';

export interface HabitTemplate {
  title: string;
  reason: string;
  category: HabitCategory;
  defaultActiveDays: number[]; // 0 to 6
}

export const INITIAL_HABIT_TEMPLATES: HabitTemplate[] = [
  {
    title: 'Ritual Matinal sem Telas',
    reason: 'Proteger os primeiros 30 minutos do dia para foco e clareza mental antes de mensagens.',
    category: 'rotina',
    defaultActiveDays: [1, 2, 3, 4, 5, 6, 0], // todos os dias
  },
  {
    title: 'Leitura Focada (15 minutos)',
    reason: 'Nutrir o intelecto com livros formativos e densos em vez de feeds de redes sociais.',
    category: 'intelectual',
    defaultActiveDays: [1, 2, 3, 4, 5, 6, 0],
  },
  {
    title: 'Estudo Técnico ou Inglês',
    reason: 'Construir vocabulário e habilidade internacional de forma contínua.',
    category: 'intelectual',
    defaultActiveDays: [1, 2, 3, 4, 5], // seg a sex
  },
  {
    title: 'Movimento Físico e Treino',
    reason: 'Garantir energia biológica, saúde cardiovascular e alívio de estresse.',
    category: 'vitalidade',
    defaultActiveDays: [1, 2, 3, 4, 5],
  },
  {
    title: 'Organização do Ambiente de Trabalho',
    reason: 'Eliminar atrito visual e manter a bancada pronta para a primeira ação do dia.',
    category: 'rotina',
    defaultActiveDays: [1, 2, 3, 4, 5],
  },
  {
    title: 'Rotina de Sono (Luzes baixas às 22h30)',
    reason: 'Preservar 7 a 8 horas de repouso profundo para recarregar a força de vontade.',
    category: 'vitalidade',
    defaultActiveDays: [1, 2, 3, 4, 5, 6, 0],
  },
  {
    title: 'Redução de Distrações (Detox Noturno)',
    reason: 'Evitar consumo passivo de telas após as 21h e melhorar o relaxamento.',
    category: 'mental',
    defaultActiveDays: [1, 2, 3, 4, 5, 6, 0],
  },
];
