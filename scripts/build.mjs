import { createHash } from 'node:crypto';
import { readFile, readdir, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { build } from 'vite';

const unite = 'public/unity';
const fichiers = (await readdir(join(unite, 'Build'))).sort();
const html = await readFile(join(unite, 'index.html'));
const empreinte = createHash('sha256').update(html);
for (const extension of ['.loader.js', '.framework.js', '.data', '.wasm']) {
  const fichier = fichiers.find(nom => nom.endsWith(extension));
  if (!fichier || !html.includes(fichier))
    throw new Error(`Export Unity WebGL incomplet ou compressé : ${extension}`);
  empreinte.update(fichier).update(await readFile(join(unite, 'Build', fichier)));
}

const version = `unity-${empreinte.digest('hex').slice(0, 16)}`;
await build({
  base: './',
  define: { 'import.meta.env.VITE_UNITY_PLAYER': JSON.stringify(version) },
});
await rename('dist/unity', join('dist', version));
