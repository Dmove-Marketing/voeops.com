// src/pages/ajuda/index.json.ts
// Índice de artigos consumido pelo app (app.voeops.com).
//
// O HelpButton do app busca aqui para sugerir o artigo certo para a tela em que
// o usuário está — o casamento é feito pelo campo `rotas`. A Central de Ajuda
// embutida no app (dentro do modal de suporte) renderiza o `corpo` (markdown
// bruto) inline, para que o cliente nunca precise sair do app para ler.
//
// Gerado estaticamente no build. Como o site é estático, não há como definir
// headers de CORS aqui: o app consome este arquivo pelo SERVIDOR (route handler
// do Next), nunca direto do browser. Ver src/app/api/support/articles/route.ts.
import type { APIRoute } from 'astro';
import { getArtigos, urlDoArtigo, slugDoArtigo, CATEGORIAS } from '../../lib/ajuda';

export const GET: APIRoute = async () => {
  const artigos = await getArtigos();

  const payload = {
    gerado_em: new Date().toISOString(),
    total: artigos.length,
    artigos: artigos.map((a) => ({
      slug: slugDoArtigo(a),
      titulo: a.data.titulo,
      descricao: a.data.descricao,
      url: `https://voeops.com${urlDoArtigo(a)}`,
      categoria: a.data.categoria,
      categoria_nome: CATEGORIAS[a.data.categoria].nome,
      rotas: a.data.rotas,
      sinonimos: a.data.sinonimos,
      ordem: a.data.ordem,
      atualizado: a.data.atualizado,
      // Markdown bruto (sem frontmatter) — o app renderiza o artigo inteiro
      // dentro da Central de Ajuda embutida, sem precisar abrir o site.
      corpo: a.body ?? '',
    })),
  };

  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
