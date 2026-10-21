import { LibraryItem } from '../types';

export const LIBRARY_DATA: LibraryItem[] = [
  {
    id: 'livro_desafio_21_dias',
    title: 'Desafio 21 Dias — Modo Avanço',
    subtitle: 'O manual de execução diária para reestruturação de rotina',
    sourceDoc: 'Desafio 21 Dias — Modo Avanço (Documento Base)',
    authorCredits: 'Metodologia Modo Avanço · Edição Prática',
    summary: 'A espinha dorsal do programa. Divide a transformação comportamental em três semanas progressivas: O Alinhamento (eliminação de atritos e organização da base), A Execução (blocos de foco inegociáveis e priorização cirúrgica) e A Maestria (identidade profissional, autoridade e sustentabilidade de longo prazo).',
    chapters: [
      {
        title: 'Semana 1: A Limpeza dos Alicerces',
        content: 'Nenhuma casa se sustenta sobre fundações trincadas. Antes de adicionar novas tarefas, a primeira semana se dedica a retirar o lixo: desordem no ambiente físico, ausência de clareza financeira, notificações descontroladas no celular e metas mal formuladas. Simplificar é a forma suprema de sofisticar a disciplina.'
      },
      {
        title: 'Semana 2: A Forja do Foco Inabalável',
        content: 'Com o terreno limpo, a execução assume o centro do palco. Aqui entra a regra das três prioridades diárias, o domínio do sono e da alimentação como fontes de energia pura, a arte de dizer não a interrupções externas e o registro disciplinado de hábitos.'
      },
      {
        title: 'Semana 3: Maestria, Imagem e Continuidade',
        content: 'A maestria não é o fim da disciplina, mas sua naturalização. O foco se volta para a postura, a comunicação sem desculpas, a rede de relacionamentos de alto valor e a consciência de que os 21 dias são apenas o portal para um estilo de vida permanente.'
      }
    ],
    practicalApplication: 'Consulte a seção Jornada no aplicativo para executar a lição correspondente ao seu dia atual com o checklist interativo.'
  },
  {
    id: 'livro_ciencia_habitos',
    title: 'A Ciência dos Hábitos',
    subtitle: 'Compreenda a neurobiologia da repetição sem apelos mágicos',
    sourceDoc: 'A Ciência dos Hábitos (Guia Teórico e Prático)',
    authorCredits: 'Fundamentação baseada em estudos comportamentais e neurociência',
    summary: 'Explora com honestidade intelectual o mecanismo de formação de hábitos: deixa (gatilho), rotina e recompensa. Desmistifica o mito de que hábitos se consolidam magicamente em 21 dias para todas as pessoas, demonstrando que a automação depende da complexidade do comportamento e da frequência consistente.',
    chapters: [
      {
        title: 'O Circuito Neural da Automação',
        content: 'Os gânglios basais do cérebro buscam constantemente economizar energia. Quando uma sequência de ações é repetida no mesmo contexto com uma recompensa previsível, o cérebro agrupa o processo em um bloco automático. Entender isso retira o peso da culpa: a falta de consistência geralmente é um problema de arquitetura de gatilhos, não de fraqueza moral.'
      },
      {
        title: 'A Regra da Substituição',
        content: 'Você raramente consegue extinguir um hábito indesejado apenas reprimindo-o com força de vontade. A estratégia mais eficaz comprovada pela ciência comportamental é manter o mesmo gatilho e a mesma recompensa emocional, alterando conscientemente apenas a rotina intermediária.'
      },
      {
        title: 'O Princípio da Menor Resistência',
        content: 'Torne o hábito positivo absurdamente fácil de começar (reduzindo o atrito para menos de 2 minutos) e torne o hábito indesejado difícil de executar (aumentando os obstáculos físicos e digitais).'
      }
    ],
    practicalApplication: 'Utilize a ferramenta Ciclo do Hábito para dissecar uma distração recorrente e cadastrar uma rota alternativa.'
  },
  {
    id: 'livro_detox_digital',
    title: 'Detox Digital',
    subtitle: 'Como resgatar sua atenção e silenciar a dopamina barata',
    sourceDoc: 'Detox Digital (Protocolo de Desintoxicação)',
    authorCredits: 'Núcleo de Produtividade e Bem-estar Digital',
    summary: 'Um protocolo sóbrio e autodeclarado para avaliar o consumo de telas, desativar gatilhos visuais e sonoros nos smartphones e restabelecer janelas deliberadas de comunicação sem recorrer a promessas irrealistas de isolamento total.',
    chapters: [
      {
        title: 'A Economia da Distração',
        content: 'Os feeds modernos são desenhados por equipes de engenharia comportamental para explorar a vulnerabilidade humana à recompensa variável. Cada atualização de tela funciona como uma roleta de estímulos. Reconhecer essa assimetria é o primeiro passo para parar de ser mero consumidor passivo.'
      },
      {
        title: 'O Protocolo dos Três Passos',
        content: 'Passo 1: Desligar todas as notificações não essenciais. Passo 2: Colocar a tela do celular em escala de cinza para neutralizar o apelo das cores saturadas. Passo 3: Definir zonas e horários livres de celular, especialmente o quarto ao dormir e a mesa de refeições.'
      },
      {
        title: 'Atividades de Alta Qualidade',
        content: 'Quando você remove 2 horas de telas da sua rotina diária, surge um vazio momentâneo. Se você não tiver atividades prazerosas de substituição preparadas (leitura física, caminhada ao ar livre, conversa real, treino), você retornará ao feed por puro tédio.'
      }
    ],
    practicalApplication: 'Acesse a ferramenta Detox Digital para estimar seu uso, fixar sua meta gradual e preencher o checklist de ambiente.'
  },
  {
    id: 'livro_mapa_diagnostico',
    title: 'Mapa de Diagnóstico',
    subtitle: 'Autoavaliação nos 4 pilares: mente, corpo, intelecto e finanças',
    sourceDoc: 'Mapa de Diagnóstico (Matriz de Avaliação Pessoal)',
    authorCredits: 'Metodologia de Diagnóstico Pessoal Modo Avanço',
    summary: 'Estrutura de autoavaliação pessoal de 0 a 10 distribuída em 4 pilares estratégicos: Domínio Mental, Vitalidade, Expansão Intelectual e Autoridade/Finanças. Permite acompanhar a evolução de percepção ao longo das semanas através de médias verificáveis.',
    chapters: [
      {
        title: 'A Importância da Clareza Inicial',
        content: 'Antes de acelerar, é imperativo saber em qual marcha você se encontra. O Mapa de Diagnóstico não é um teste clínico nem uma nota de aprovação escolar: é um espelho honesto para identificar qual área da sua vida está drenando sua energia vital.'
      },
      {
        title: 'O Efeito Alavanca dos Pilares',
        content: 'Geralmente, elevar a nota de um único subitem em Vitalidade (como melhorar a qualidade do sono) reverbera imediatamente na pontuação de Foco em Domínio Mental e na Execução de Metas em Expansão Intelectual. Trabalhar a raiz traz alívio para os galhos.'
      },
      {
        title: 'Comparação Saudável',
        content: 'A única comparação válida no diagnóstico é a da sua nota atual com a sua nota de 7 ou 21 dias atrás. O registro histórico datado permite ver o avanço real e ajustar onde houver estagnação.'
      }
    ],
    practicalApplication: 'Acesse o Mapa de Diagnóstico na aba Perfil ou Ferramentas e registre sua autoavaliação atual.'
  },
  {
    id: 'livro_rastreador_habitos',
    title: 'Rastreador de Hábitos de Elite',
    subtitle: 'O método visual para sustentar consistência sem paralisia',
    sourceDoc: 'Rastreador de Hábitos de Elite (Guia de Monitoramento)',
    authorCredits: 'Sistema de Acompanhamento Comportamental',
    summary: 'Orientações práticas para escolher de 3 a 5 hábitos fundamentais, calibrar a frequência semanal sem metas ilusórias e aplicar o princípio de que falhas pontuais nunca devem virar rupturas definitivas de identidade.',
    chapters: [
      {
        title: 'Menos Hábitos, Maior Profundidade',
        content: 'O erro clássico do iniciante é tentar adotar 12 hábitos novos de uma só vez na segunda-feira. A força de vontade colapsa na quinta-feira. Escolher de 3 a 5 hábitos nucleares (por exemplo: sono, hidratação, leitura e treino) garante uma taxa de adesão sustentável.'
      },
      {
        title: 'O Cálculo Justo de Adesão',
        content: 'Se um hábito foi programado para 3 vezes na semana (segunda, quarta e sexta), dias de terça e quinta não são falhas. O cálculo correto de disciplina só considera os compromissos que você efetivamente assumiu com você mesmo até o dia de hoje.'
      },
      {
        title: 'A Regra de Retomada',
        content: 'Se você esqueceu ou não conseguiu cumprir o hábito hoje, sua única obrigação moral é não falhar amanhã. Essa regra simples impede o efeito "já que errei hoje, vou errar a semana inteira".'
      }
    ],
    practicalApplication: 'Utilize a aba Hábitos para gerenciar sua rotina com o calendário mensal interativo e ver suas sequências reais.'
  },
  {
    id: 'livro_redefinicao_metas',
    title: 'Redefinição de Metas',
    subtitle: 'Do sonho vago ao plano de ação estruturado em etapas',
    sourceDoc: 'Redefinição de Metas (Metodologia de Planejamento)',
    authorCredits: 'Planejamento Estratégico Pessoal Modo Avanço',
    summary: 'Aprofunda a metodologia de metas SMART integradas à realidade do adulto moderno: definição de critérios de sucesso, métricas objetivas, obstáculos previstos e rituais de revisão semanal para correção contínua de rumo.',
    chapters: [
      {
        title: 'Por Que Metas Tradicionais Falham',
        content: 'Metas falham quando são apenas desejos emocionais sem data, sem unidade de medida e sem primeiro passo imediato. A mente humana precisa de fronteiras bem delimitadas para canalizar o esforço.'
      },
      {
        title: 'O Poder dos Marcos Intermediários',
        content: 'Um objetivo de 90 dias pode parecer distante e gerar procrastinação nas primeiras 4 semanas. Ao quebrar o objetivo em 3 ou 4 marcos menores de 20 dias, você mantém o senso de urgência e saboreia pequenas vitórias ao longo da caminhada.'
      },
      {
        title: 'A Revisão Semanal de 15 Minutos',
        content: 'Toda sexta-feira ou domingo, faça 4 perguntas fundamentais: 1. O que eu avancei? 2. O que me travou? 3. Qual ajuste farei? 4. Qual será meu primeiro passo na segunda-feira?'
      }
    ],
    practicalApplication: 'Acesse a seção de Metas para criar ou revisar seu objetivo trimestral com o assistente estruturado.'
  },
  {
    id: 'livro_vencendo_procrastinacao',
    title: 'Vencendo a Procrastinação',
    subtitle: 'Estratégias práticas contra o medo de começar e o perfeccionismo',
    sourceDoc: 'Vencendo a Procrastinação (Manual de Ação Imediata)',
    authorCredits: 'Psicologia Comportamental Aplicada à Execução',
    summary: 'Desmonta as causas profundas do adiamento crônico: não se trata de preguiça, mas de um mecanismo de defesa contra o desconforto e o medo de falhar. Apresenta a Regra dos 2 Minutos e os Blocos de Foco como antídotos imediatos.',
    chapters: [
      {
        title: 'A Anatomia do Desconforto',
        content: 'A procrastinação ocorre no exato instante em que o cérebro antecipa o esforço da tarefa como algo desagradável e busca alívio imediato em uma distração rápida. Uma vez iniciada a tarefa, a dor cerebral desaparece após cerca de 2 a 3 minutos.'
      },
      {
        title: 'A Regra dos 2 Minutos na Prática',
        content: 'Quando uma tarefa parecer gigantesca ou paralisante, esqueça a conclusão do todo. Comprometa-se apenas com uma micro-ação de 2 minutos (abrir o documento e escrever o título, colocar os tênis de corrida, abrir a planilha). O objetivo não é terminar, mas quebrar o atrito estático da inércia.'
      },
      {
        title: 'O Fim do Perfeccionismo Tóxico',
        content: '“Feito com rigor é infinitamente superior ao perfeito que nunca saiu da cabeça”. Permita-se fazer um primeiro rascunho imperfeito. A qualidade é filha da iteração, nunca da paralisia analítica.'
      }
    ],
    practicalApplication: 'Utilize o atalho "Começar por 2 Minutos" na tela Hoje para destravar a tarefa que você está adiando agora.'
  }
];
