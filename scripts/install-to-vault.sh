#!/bin/sh
# Compila questo ramo e lo installa nel vault come plugin "kanbase-fork".
# L'id è diverso da "kanbase" perché Obsidian non lo aggiorni dal catalogo
# sovrascrivendo le modifiche del fork. Uso: scripts/install-to-vault.sh [percorso-vault]
set -eu

VAULT="${1:-$HOME/Developer/ilmeskio/vault}"
DEST="$VAULT/.obsidian/plugins/kanbase-fork"

cd "$(dirname "$0")/.."
mise exec -- npm run build

mkdir -p "$DEST"
cp main.js styles.css "$DEST/"

REV="$(git rev-parse --short HEAD)"
REV="$REV" node -e '
  const fs = require("fs");
  const m = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
  m.id = "kanbase-fork";
  m.name = "Kanbase (fork)";
  m.version = `${m.version}-vault.${process.env.REV}`;
  fs.writeFileSync(process.argv[1], JSON.stringify(m, null, 2) + "\n");
' "$DEST/manifest.json"

echo "Installato in $DEST ($(node -p 'require("./'"$DEST"'/manifest.json").version' 2>/dev/null || echo "$REV"))"
echo "Ricarica: obsidian vault=vault plugin:reload id=kanbase-fork"
