// Regera as webp da seção "Explore os principais recursos" preservando o aspecto
// das fontes de alta resolução (~2030x1293, ratio 1.57). As webp antigas estavam
// forçadas para 1500x700 (ratio 2.143), o que esticava/achatava os screenshots.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'tabs');

// tab -> arquivo fonte de alta resolução
const sources = {
  'tab-conversas':    'tab-conversas.jpeg',
  'tab-negociacoes':  'tab-negociacoes.png',
  'tab-oportunidade': 'tab-oportunidade.png',
  'tab-atividades':   'tab-atividades.png',
  'tab-whatsapp':     'tab-whatsapp.jpeg',
  'tab-agenda':       'tab-agenda.png',
  'tab-audiencias':   'tab-audiencias.png',
  'tab-campanhas':    'tab-campanhas.png',
  'tab-automacoes':   'tab-automacoes.png',
};

const TARGET_W = 1500; // largura padrão; altura calculada preservando o aspecto

const results = [];
for (const [base, file] of Object.entries(sources)) {
  const src = path.join(dir, file);
  const out = path.join(dir, `${base}.webp`);
  const info = await sharp(src)
    .resize({ width: TARGET_W, withoutEnlargement: false })
    .webp({ quality: 82, effort: 6 })
    .toFile(out);
  results.push(`${base}.webp -> ${info.width}x${info.height}`);
}

// Variantes responsivas usadas no <img srcset> do conversas
for (const w of [480, 900]) {
  const out = path.join(dir, `tab-conversas-${w}w.webp`);
  const info = await sharp(path.join(dir, 'tab-conversas.jpeg'))
    .resize({ width: w })
    .webp({ quality: 80, effort: 6 })
    .toFile(out);
  results.push(`tab-conversas-${w}w.webp -> ${info.width}x${info.height}`);
}

console.log(results.join('\n'));
