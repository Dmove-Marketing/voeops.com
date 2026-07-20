// src/content.config.ts
// Central de Ajuda — collection dos artigos de suporte.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const CATEGORIAS = {
  'primeiros-passos': {
    nome: 'Primeiros passos',
    descricao: 'Criar a conta, configurar e trazer sua equipe.',
    icone: 'rocket',
    ordem: 1,
  },
  whatsapp: {
    nome: 'WhatsApp e Conversas',
    descricao: 'Conexão, envio de mensagens, mídia e histórico.',
    icone: 'chat',
    ordem: 2,
  },
  crm: {
    nome: 'CRM',
    descricao: 'Contatos, empresas, oportunidades e atividades.',
    icone: 'kanban',
    ordem: 3,
  },
  campanhas: {
    nome: 'Campanhas e Audiências',
    descricao: 'Segmentação, disparos e modelos de mensagem.',
    icone: 'send',
    ordem: 4,
  },
  automacoes: {
    nome: 'Automações',
    descricao: 'Gatilhos e movimentação automática do funil.',
    icone: 'zap',
    ordem: 5,
  },
  agentes: {
    nome: 'Agentes de IA',
    descricao: 'SDR, inteligência de CRM e consumo de tokens.',
    icone: 'bot',
    ordem: 6,
  },
  financeiro: {
    nome: 'Financeiro',
    descricao: 'Controle de receitas e recebimentos.',
    icone: 'wallet',
    ordem: 7,
  },
  insights: {
    nome: 'Insights',
    descricao: 'Relatórios, métricas e desempenho.',
    icone: 'chart',
    ordem: 8,
  },
  conta: {
    nome: 'Conta e Cobrança',
    descricao: 'Planos, limites, faturas e cancelamento.',
    icone: 'card',
    ordem: 9,
  },
  configuracoes: {
    nome: 'Configurações',
    descricao: 'Horário comercial, distribuição, unidades e e-mail.',
    icone: 'settings',
    ordem: 10,
  },
} as const;

export type CategoriaId = keyof typeof CATEGORIAS;

const ajuda = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ajuda' }),
  schema: z.object({
    /** Título do artigo — deve ser a DÚVIDA do cliente, não o nome da feature. */
    titulo: z.string(),
    /** 1-2 linhas. Vira a meta description e o resumo nas listagens. */
    descricao: z.string(),
    categoria: z.enum(
      Object.keys(CATEGORIAS) as [CategoriaId, ...CategoriaId[]]
    ),
    /**
     * Rotas do app onde este artigo é relevante.
     * É o que permite ao HelpButton (app.voeops.com) sugerir o artigo certo
     * para a tela em que o usuário está. Aceita prefixos: "/settings" casa
     * com "/settings?tab=canais".
     */
    rotas: z.array(z.string()).default([]),
    /** Termos alternativos que o cliente digitaria na busca. */
    sinonimos: z.array(z.string()).default([]),
    /** Ordem dentro da categoria (menor = mais acima). */
    ordem: z.number().default(99),
    atualizado: z.coerce.date(),
    /**
     * Revisão factual por alguém da Voe.
     * Artigo com `revisado: false` NÃO aparece em produção (ver getArtigos()).
     */
    revisado: z.boolean().default(false),
  }),
});

export const collections = { ajuda };
