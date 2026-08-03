#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const [envFileArg, ...cmdArgs] = process.argv.slice(2);

if (!envFileArg || cmdArgs.length === 0) {
  console.error('Uso: node env-run.js <arquivo.env> <comando> [args...]');
  process.exit(1);
}

const envPath = path.resolve(__dirname, envFileArg);

if (!fs.existsSync(envPath)) {
  console.error(`Arquivo de ambiente não encontrado: ${envPath}`);
  process.exit(1);
}

const env = { ...process.env };
const lines = fs.readFileSync(envPath, 'utf-8').split('\n');

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIndex = trimmed.indexOf('=');
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex).trim();
  const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
  env[key] = value;
}

const result = spawnSync(cmdArgs[0], cmdArgs.slice(1), {
  env,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
