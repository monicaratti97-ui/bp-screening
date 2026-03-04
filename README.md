# Battery Passport Screening Tool

Strumento di pre-assessment per consulenti e auditor. Valuta la maturità di un'azienda rispetto agli obblighi del **Battery Passport EU**, organizzato nelle 7 macro-categorie del Data Attribute Longlist (BatteryPass-Ready v1.3, dicembre 2025).

---

## Cos'è

Un questionario interattivo a step che guida l'auditor attraverso le 7 aree normative del Battery Passport, producendo una **gap analysis** con:

- Score di maturità per categoria (Buona / Intermedia / Critica)
- Elenco gap critici (attributi assenti) e gap parziali
- Riferimenti normativi per ogni domanda
- Note operative per l'auditor

**Batteria target:** EV (veicoli elettrici) — basato su BattReg (UE) 2023/1542 e draft JTC-24 (stato: dicembre 2025).

---

## Struttura del progetto

```
app/
└── battery-screening/
    └── page.tsx          ← componente principale dello screening
```

---

## Categorie coperte

| Codice | Categoria | Attributi BP | Obbligatori EV |
|--------|-----------|:------------:|:--------------:|
| A | Identifiers & Product Data | 19 | 13 |
| B | Performance & Durability | 42 | 38 |
| C | Battery Carbon Footprint | 8 | 8 |
| D | Battery Materials & Composition | 5 | 5 |
| E | Circularity & Resource Efficiency | 15 | 12 |
| F | Supply Chain Due Diligence | 3 | 3 |
| G | Symbols, Labels & Conformity | 7 | 7 |
| **Totale** | | **99** | **86** |

---

## Installazione

### Prerequisiti

- Node.js 18+
- npm o yarn

### Setup

```bash
# Clona o apri il progetto
cd bp-screening

# Installa le dipendenze
npm install

# Avvia in sviluppo
npm run dev
```

Apri il browser su:

```
http://localhost:3000/battery-screening
```

Se usi GitHub Codespaces o un ambiente remoto, l'URL sarà del tipo:

```
https://<nome-codespace>-3000.app.github.dev/battery-screening
```

---

## Font

Il componente usa **DM Sans** (Google Fonts). Per caricarlo correttamente in Next.js, aggiungi in `app/layout.tsx`:

```tsx
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
```

---

## Troubleshooting

### Porta già in uso / lock file

```bash
# Elimina il file di lock di Next.js
rm -rf .next/dev/lock

# Oppure avvia su una porta diversa
npm run dev -- -p 3001
```

### Pagina 404 su /battery-screening

Verifica che il file sia nel percorso corretto:

```bash
ls app/battery-screening/
# deve mostrare: page.tsx
```

---

## Riferimenti normativi

- **BattReg** — Regolamento (UE) 2023/1542 relativo alle batterie e ai rifiuti di batterie
- **ESPR** — Regolamento (UE) 2024/1781 sulla progettazione ecocompatibile
- **DIN DKE Spec 99100** — Specifica tecnica tedesca per il Battery Passport
- **JTC-24** — Draft prEN 18219 / 18222 / 18223 (stato bozza, dicembre 2025)
- **BatteryPass-Ready v1.3** — Data Attribute Longlist, dicembre 2025

---

## Disclaimer

Questo strumento è uno **screening preliminare**. Non sostituisce audit formali, certificazioni di terza parte o consulenza legale. I requisiti normativi potranno essere modificati nel corso dei processi regolatori e di standardizzazione in corso.
