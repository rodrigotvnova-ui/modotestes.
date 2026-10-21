export interface DiagnosticItemConfig {
  id: string;
  pillarId: 'mental' | 'vitalidade' | 'intelectual' | 'autoridade';
  title: string;
  description: string;
  lowPrompt: string; // What 0-3 represents
  highPrompt: string; // What 8-10 represents
  recommendedAction: string;
}

export interface DiagnosticPillarConfig {
  id: 'mental' | 'vitalidade' | 'intelectual' | 'autoridade';
  name: string;
  description: string;
  icon: string;
  items: DiagnosticItemConfig[];
  color: string;
}

export const DIAGNOSTIC_PILLARS: DiagnosticPillarConfig[] = [
  {
    id: 'mental',
    name: 'Domínio Mental',
    description: 'Capacidade de manter a atenção deliberada, clareza matinal e filtro de estímulos externos.',
    icon: 'Brain',
    color: '#9275FF',
    items: [
      {
        id: 'foco_clareza',
        pillarId: 'mental',
        title: 'Foco e Clareza',
        description: 'Capacidade de trabalhar em tarefas complexas sem dispersão constante.',
        lowPrompt: 'Facilmente distraído por abas, pensamentos aleatórios e interrupções.',
        highPrompt: 'Consegue sustentar blocos de 50 minutos de trabalho focado sem interrupção.',
        recommendedAction: 'Inicie o dia com a ferramenta Começar por 2 Minutos para quebrar a inércia.',
      },
      {
        id: 'ritual_matinal',
        pillarId: 'mental',
        title: 'Ritual Matinal',
        description: 'Qualidade dos primeiros 30 a 60 minutos do dia antes de acessar mensagens.',
        lowPrompt: 'Acorda no susto, pega o celular ainda na cama e reage a notificações.',
        highPrompt: 'Rotina estruturada de hidratação, luz natural e planejamento sem telas.',
        recommendedAction: 'Adicione o hábito "Ritual Matinal" com 3 passos simples de 5 minutos.',
      },
      {
        id: 'controle_estimulos',
        pillarId: 'mental',
        title: 'Controle de Estímulos',
        description: 'Domínio sobre notificações, feeds infinitos e compulsão por novidades digitais.',
        lowPrompt: 'Checa o smartphone dezenas de vezes por hora sem motivo claro.',
        highPrompt: 'Notificações silenciadas; usa redes apenas em janelas deliberadas.',
        recommendedAction: 'Use o módulo Detox Digital para planejar duas janelas fechadas de uso de celular.',
      },
    ],
  },
  {
    id: 'vitalidade',
    name: 'Vitalidade',
    description: 'A base biológica da disciplina: sono restaurador, nutrição equilibrada e movimento corporal.',
    icon: 'Zap',
    color: '#10B981',
    items: [
      {
        id: 'alimentacao',
        pillarId: 'vitalidade',
        title: 'Alimentação Consciente',
        description: 'Consistência de refeições equilibradas que fornecem energia contínua sem letargia.',
        lowPrompt: 'Comidas ultraprocessadas frequentes, excesso de açúcar e quedas de disposição.',
        highPrompt: 'Refeições ricas em comida de verdade, hidratação adequada e digestão leve.',
        recommendedAction: 'Beba 500ml de água ao acordar e evite carboidratos pesados no almoço.',
      },
      {
        id: 'energia_sono',
        pillarId: 'vitalidade',
        title: 'Energia e Sono',
        description: 'Regularidade de horário de dormir e sensação de repouso genuíno ao despertar.',
        lowPrompt: 'Sono irregular, uso de telas até tarde, fadiga crônica durante a tarde.',
        highPrompt: 'Dorme 7-8h em ambiente escuro, acorda com energia sem depender de excesso de café.',
        recommendedAction: 'Desligue telas 45 minutos antes de deitar e mantenha horário fixo de sono.',
      },
      {
        id: 'ativacao_fisica',
        pillarId: 'vitalidade',
        title: 'Ativação Física',
        description: 'Frequência semanal de exercícios e movimento corporal vigoroso.',
        lowPrompt: 'Sedentarismo completo ou atividade física apenas esporádica.',
        highPrompt: 'Treinos regulares (3 a 5 vezes na semana) com consistência inegociável.',
        recommendedAction: 'Adicione o hábito "Movimento Físico" com meta de 20 minutos de caminhada diária.',
      },
    ],
  },
  {
    id: 'intelectual',
    name: 'Expansão Intelectual',
    description: 'Desenvolvimento intencional de competências: leitura, idiomas e execução de projetos.',
    icon: 'BookOpen',
    color: '#3B82F6',
    items: [
      {
        id: 'consistencia_leitura',
        pillarId: 'intelectual',
        title: 'Consistência de Leitura',
        description: 'Hábito de ler livros densos e formativos diariamente.',
        lowPrompt: 'Não lê livros há meses ou abandona obras logo nas primeiras páginas.',
        highPrompt: 'Lê de 10 a 30 páginas diárias com anotações e reflexões práticas.',
        recommendedAction: 'Inicie com 5 páginas por dia imediatamente após o café da manhã.',
      },
      {
        id: 'estudo_ingles',
        pillarId: 'intelectual',
        title: 'Estudo de Idiomas / Inglês',
        description: 'Prática contínua de aperfeiçoamento de vocabulário e escuta técnica.',
        lowPrompt: 'Estudo interrompido ou sensação de estagnação de vocabulário.',
        highPrompt: 'Contato diário com artigos, áudios ou aulas de aprofundamento.',
        recommendedAction: 'Dedique 15 minutos diários para ouvir podcasts ou ler artigos em inglês.',
      },
      {
        id: 'execucao_metas',
        pillarId: 'intelectual',
        title: 'Execução de Metas',
        description: 'Capacidade de transformar metas abstratas em marcos semanais concluídos.',
        lowPrompt: 'Planeja muito no papel, mas raramente conclui o que começou.',
        highPrompt: 'Metas SMART com acompanhamento semanal e marcos atingidos no prazo.',
        recommendedAction: 'Cadastre sua principal meta no assistente SMART e defina os marcos.',
      },
    ],
  },
  {
    id: 'autoridade',
    name: 'Autoridade e Finanças',
    description: 'Segurança financeira, imagem profissional e capacidade de comunicação assertiva.',
    icon: 'Shield',
    color: '#A855F7',
    items: [
      {
        id: 'organizacao_financeira',
        pillarId: 'autoridade',
        title: 'Organização Financeira',
        description: 'Conhecimento dos números mensais e construção regular de reserva de emergência.',
        lowPrompt: 'Não sabe para onde vai o dinheiro e vive sob constante ansiedade financeira.',
        highPrompt: 'Planilha/registro atualizado, gastos sob controle e reserva crescendo.',
        recommendedAction: 'Lance suas receitas e despesas no módulo financeiro básico do app.',
      },
      {
        id: 'imagem_estrategica',
        pillarId: 'autoridade',
        title: 'Imagem Estratégica',
        description: 'Apresentação pessoal, cuidado com postura e ambiente de trabalho.',
        lowPrompt: 'Desleixo com vestuário e postura descuidada durante as horas de trabalho.',
        highPrompt: 'Aparência alinhada à autoridade profissional e postura firme.',
        recommendedAction: 'Pratique o dia 16 da jornada: vestindo-se para a sua melhor versão profissional.',
      },
      {
        id: 'comunicacao',
        pillarId: 'autoridade',
        title: 'Comunicação Assertiva',
        description: 'Capacidade de expor ideias, dizer não e alinhar expectativas com clareza.',
        lowPrompt: 'Insegurança para se posicionar, medo de dizer não ou prolixidade excessiva.',
        highPrompt: 'Expressa limites com tranquilidade, precisão e escuta ativa de alto nível.',
        recommendedAction: 'Exercite responder mensagens profissionais de forma concisa e direta.',
      },
    ],
  },
];

/**
 * Calculates pillar averages and overall average ignoring pending (null) items.
 * Rule: Sum of answered scores divided strictly by count of answered items.
 * If no item is answered in a pillar, average is returned as 0.
 */
export function calculateDiagnosticAverages(scores: Record<string, number | null>) {
  const pillarAverages: Record<string, number> = {};
  let totalAnsweredScores = 0;
  let totalAnsweredCount = 0;

  for (const pillar of DIAGNOSTIC_PILLARS) {
    let pillarScoreSum = 0;
    let pillarAnsweredCount = 0;

    for (const item of pillar.items) {
      const val = scores[item.id];
      if (val !== null && val !== undefined) {
        pillarScoreSum += val;
        pillarAnsweredCount += 1;
        totalAnsweredScores += val;
        totalAnsweredCount += 1;
      }
    }

    pillarAverages[pillar.id] = pillarAnsweredCount > 0
      ? Number((pillarScoreSum / pillarAnsweredCount).toFixed(1))
      : 0;
  }

  const overallAverage = totalAnsweredCount > 0
    ? Number((totalAnsweredScores / totalAnsweredCount).toFixed(1))
    : 0;

  return {
    pillarAverages,
    overallAverage,
    answeredCount: totalAnsweredCount,
    totalQuestions: 12,
  };
}
