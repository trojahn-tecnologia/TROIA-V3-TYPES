/**
 * Release interativo do @troia-v3/types — `npm run release` (em TROIA-V3-TYPES/).
 *
 * Fluxo:
 *   1. (opcional) bump patch --no-git-tag-version + build + pack
 *   2. Descobre os projetos consumidores no monorepo (package.json com @troia-v3/types)
 *   3. Menu: você escolhe QUAIS projetos atualizar (nada de engessar todos)
 *   4. Para cada escolhido: copia o tgz pra RAIZ do projeto, `npm install ./<tgz>`
 *      (package.json fica `file:troia-v3-types-X.X.X.tgz` — path relativo à raiz,
 *      que é o que funciona no deploy) e remove tgz de versões anteriores da raiz.
 *
 * ⚠️ NUNCA instalar com `npm install ../TROIA-V3-TYPES/<tgz>` — funciona local mas
 * quebra o deploy: cada repositório é standalone no servidor, sem a pasta
 * TROIA-V3-TYPES ao lado. Convenção: 1 tgz por raiz de consumidor (versão pinada).
 *
 * Requer Node >= 22.18 (roda .ts nativo). Sem dependências externas.
 */

import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

interface Consumer {
  name: string;
  dir: string;
  currentSpec: string;
}

const TYPES_DIR = process.cwd(); // npm run sempre executa com cwd = raiz do pacote
const MONOREPO_DIR = path.resolve(TYPES_DIR, '..');

function run(cmd: string, cwd: string): void {
  console.log(`\n$ ${cmd}  (em ${path.basename(cwd)})`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function readPackageJson(dir: string): Record<string, unknown> | null {
  const file = path.join(dir, 'package.json');
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function typesSpecOf(pkg: Record<string, unknown>): string | null {
  for (const key of ['dependencies', 'devDependencies']) {
    const deps = pkg[key] as Record<string, string> | undefined;
    const spec = deps?.['@troia-v3/types'];
    if (spec) return spec;
  }
  return null;
}

function discoverConsumers(): Consumer[] {
  const consumers: Consumer[] = [];
  for (const entry of fs.readdirSync(MONOREPO_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(MONOREPO_DIR, entry.name);
    if (path.resolve(dir) === path.resolve(TYPES_DIR)) continue;
    const pkg = readPackageJson(dir);
    if (!pkg) continue;
    const spec = typesSpecOf(pkg);
    if (spec) consumers.push({ name: entry.name, dir, currentSpec: spec });
  }
  return consumers.sort((a, b) => a.name.localeCompare(b.name));
}

function removeOldTgz(dir: string, keep: string): string[] {
  const removed: string[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (/^troia-v3-types-.*\.tgz$/.test(file) && file !== keep) {
      fs.rmSync(path.join(dir, file));
      removed.push(file);
    }
  }
  return removed;
}

async function main(): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  console.log('══════════════════════════════════════════════');
  console.log('  @troia-v3/types — release + distribuição');
  console.log('══════════════════════════════════════════════');

  // ── 1. Bump + build + pack (opcional) ──────────────────────────────
  const bumpAnswer = (await rl.question('\nGerar nova versão patch (bump + build + pack)? [S/n] ')).trim().toLowerCase();
  const doBump = bumpAnswer === '' || bumpAnswer === 's' || bumpAnswer === 'sim' || bumpAnswer === 'y';

  if (doBump) {
    run('npm version patch --no-git-tag-version', TYPES_DIR);
    run('npm run build', TYPES_DIR);
    run('npm pack', TYPES_DIR);
  }

  const typesPkg = readPackageJson(TYPES_DIR);
  const version = typesPkg?.version as string | undefined;
  if (!version) {
    console.error('❌ Não consegui ler a versão do package.json do TROIA-V3-TYPES.');
    process.exitCode = 1;
    rl.close();
    return;
  }
  const tgzName = `troia-v3-types-${version}.tgz`;
  const tgzPath = path.join(TYPES_DIR, tgzName);
  if (!fs.existsSync(tgzPath)) {
    console.error(`❌ ${tgzName} não existe em TROIA-V3-TYPES/. Rode com bump ou gere o pack antes (npm pack).`);
    process.exitCode = 1;
    rl.close();
    return;
  }
  console.log(`\n📦 Versão a distribuir: ${version}  (${tgzName})`);

  // ── 2. Descobrir consumidores ──────────────────────────────────────
  const consumers = discoverConsumers();
  if (consumers.length === 0) {
    console.error('❌ Nenhum projeto consumidor de @troia-v3/types encontrado no monorepo.');
    process.exitCode = 1;
    rl.close();
    return;
  }

  console.log('\nProjetos que usam @troia-v3/types:\n');
  consumers.forEach((c, i) => {
    const pinned = c.currentSpec.match(/troia-v3-types-([\d.]+)\.tgz/)?.[1] ?? c.currentSpec;
    const upToDate = pinned === version ? ' (já na versão nova)' : '';
    console.log(`  [${i + 1}] ${c.name}  —  atual: ${pinned}${upToDate}`);
  });

  // ── 3. Seleção ─────────────────────────────────────────────────────
  const selectionRaw = (await rl.question(
    "\nQuais atualizar? (números separados por vírgula, 'a' = todos, Enter = cancelar) "
  )).trim().toLowerCase();
  rl.close();

  if (selectionRaw === '') {
    console.log('Cancelado — nada foi alterado.');
    return;
  }

  let selected: Consumer[];
  if (selectionRaw === 'a' || selectionRaw === 'todos') {
    selected = consumers;
  } else {
    const indexes = selectionRaw.split(',').map((s) => Number(s.trim()));
    if (indexes.some((n) => !Number.isInteger(n) || n < 1 || n > consumers.length)) {
      console.error(`❌ Seleção inválida: "${selectionRaw}". Use números de 1 a ${consumers.length}.`);
      process.exitCode = 1;
      return;
    }
    selected = [...new Set(indexes)].map((n) => consumers[n - 1] as Consumer);
  }

  // ── 4. Distribuir ──────────────────────────────────────────────────
  const results: string[] = [];
  const failures: string[] = [];

  for (const consumer of selected) {
    console.log(`\n──── ${consumer.name} ────`);
    try {
      fs.copyFileSync(tgzPath, path.join(consumer.dir, tgzName));
      run(`npm install ./${tgzName}`, consumer.dir);

      // Verificação: package.json TEM que apontar pra raiz do próprio projeto
      const pkg = readPackageJson(consumer.dir);
      const spec = pkg ? typesSpecOf(pkg) : null;
      if (spec !== `file:${tgzName}`) {
        throw new Error(`spec inesperada no package.json: "${spec}" (esperado "file:${tgzName}")`);
      }

      const removed = removeOldTgz(consumer.dir, tgzName);
      results.push(`✅ ${consumer.name}: file:${tgzName}${removed.length ? ` (removido: ${removed.join(', ')})` : ''}`);
    } catch (error) {
      failures.push(`❌ ${consumer.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // ── 5. Resumo ──────────────────────────────────────────────────────
  console.log('\n══════════════ RESUMO ══════════════');
  for (const line of [...results, ...failures]) console.log(line);
  if (failures.length > 0) process.exitCode = 1;
  console.log('\nLembrete: rodar typecheck/build nos projetos atualizados antes do deploy.');
}

void main();
