# Fork per il vault

Questo fork serve il vault di ilmeskio. I rami:

- `main` segue `luciopaiva/obsidian-kanbase` e non riceve commit nostri.
- `fix/*` e `feat/*` sono le modifiche, una per ramo, ciascuna pronta per una pull request all'upstream.
- `vault` riunisce tutte le modifiche e contiene questo file e `scripts/install-to-vault.sh`. È il ramo che si installa.

## Modifiche in corso

| Ramo | Cosa fa |
|---|---|
| `fix/swimlane-single-values` | Una property con un solo valore resta un solo valore quando una scheda cambia riga. I link `[[Nota]]` si mostrano col nome della nota. |
| `fix/respect-bases-order` | Le schede senza `kanbase_order` seguono l'ordine che Bases dà con `sort`, non la data di creazione. |
| `feat/swimlane-property-picker` | La property delle swimlane si sceglie da un menu a tendina nelle opzioni della vista (`swimlaneProperty`); cambiandola le righe salvate dell'altra property si scartano. `swimlane.property` scritto a mano funziona ancora. |
| `feat/collapsed-by-default` | Opzione di vista `collapsedByDefault` (per esempio `done, backlog`): quelle colonne si aprono chiuse a ogni apertura, senza scrivere nel file `.base`. |

## Installare nel vault

```sh
scripts/install-to-vault.sh
```

Compila e copia i file in `.obsidian/plugins/kanbase-fork/`, con id `kanbase-fork`. Con un id diverso da `kanbase`, Obsidian non lo aggiorna dal catalogo.

## Seguire l'upstream

```sh
git fetch upstream
git switch main && git merge --ff-only upstream/main && git push origin main
for b in fix/swimlane-single-values fix/respect-bases-order feat/swimlane-property-picker feat/collapsed-by-default; do
  git switch "$b" && git rebase main
done
git switch -C vault main
for b in fix/swimlane-single-values fix/respect-bases-order feat/swimlane-property-picker feat/collapsed-by-default; do git merge --no-edit "$b"; done
git checkout origin/vault -- VAULT.md scripts/install-to-vault.sh
git commit -m "Add vault install script and fork notes"
scripts/install-to-vault.sh
```

Il ramo `vault` si ricrea da `main` più le modifiche. Questo file e lo script non stanno in nessun altro ramo, quindi si recuperano da `origin/vault` prima di pubblicare il nuovo `vault`.
