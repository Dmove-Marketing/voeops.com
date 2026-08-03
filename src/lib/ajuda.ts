// src/lib/ajuda.ts
// Helpers da Central de Ajuda.
import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIAS, type CategoriaId } from '../content.config';

export type Artigo = CollectionEntry<'ajuda'>;

/**
 * SALVAGUARDA DE PRODUÇÃO
 *
 * Artigo com `revisado: false` só aparece em dev (`astro dev`) e em preview.
 * Em build de produção ele é excluído do site, do sitemap e do índice de busca.
 *
 * Motivo: artigo desatualizado ou tecnicamente errado é PIOR que artigo
 * inexistente — o cliente segue o passo errado, quebra mais, e volta bravo.
 * Nenhum artigo vai ao ar sem revisão factual de alguém da Voe.
 *
 * Para publicar: marque `revisado: true` no frontmatter.
 */
const MOSTRAR_NAO_REVISADOS = import.meta.env.DEV;

export async function getArtigos(): Promise<Artigo[]> {
  const todos = await getCollection('ajuda');
  const visiveis = MOSTRAR_NAO_REVISADOS
    ? todos
    : todos.filter((a) => a.data.revisado);

  return visiveis.sort((a, b) => {
    const catA = CATEGORIAS[a.data.categoria].ordem;
    const catB = CATEGORIAS[b.data.categoria].ordem;
    if (catA !== catB) return catA - catB;
    return a.data.ordem - b.data.ordem;
  });
}

export async function getArtigosPorCategoria() {
  const artigos = await getArtigos();
  const mapa = new Map<CategoriaId, Artigo[]>();

  for (const artigo of artigos) {
    const cat = artigo.data.categoria;
    if (!mapa.has(cat)) mapa.set(cat, []);
    mapa.get(cat)!.push(artigo);
  }

  // Ordena as categorias e descarta as que ficaram sem artigo visível
  return (Object.keys(CATEGORIAS) as CategoriaId[])
    .filter((id) => mapa.has(id))
    .sort((a, b) => CATEGORIAS[a].ordem - CATEGORIAS[b].ordem)
    .map((id) => ({
      id,
      ...CATEGORIAS[id],
      artigos: mapa.get(id)!,
    }));
}

/** Slug do artigo sem a pasta da categoria: "whatsapp/foo" -> "foo" */
export function slugDoArtigo(artigo: Artigo): string {
  return artigo.id.split('/').pop()!;
}

export function urlDoArtigo(artigo: Artigo): string {
  return `/ajuda/${artigo.data.categoria}/${slugDoArtigo(artigo)}`;
}

export { CATEGORIAS };
export type { CategoriaId };
