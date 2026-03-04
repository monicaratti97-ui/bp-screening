"use client"

import { useState, useMemo } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "identifiers",
    code: "A",
    title: "Identifiers & Product Data",
    subtitle: "Identificatori, DPP, informazioni su produttore e operatore",
    totalAttributes: 19,
    regulation: "Art. 77(3) BattReg; ESPR Art. 12; JTC-24 prEN_18222/18223",
    keyAttributes: [
      "Battery Passport Identifier (univoco, URI/URL-based)",
      "Battery Identifier (conforme ISO/IEC 15459)",
      "Manufacturer Identifier + informazioni complete",
      "Economic Operator Identifier",
      "Facility Identifier (luogo di produzione)",
      "Battery Status (Active/Archived)",
      "DPP Schema Version e Granularity",
      "Manufacturer & Model information",
      "Date/time ultimo aggiornamento DPP",
    ],
    mandatoryEV: 13,
    voluntaryEV: 6,
    questions: [
      {
        id: "id_passport",
        text: "Il Battery Passport Identifier è presente e globalmente univoco (URI/URL-based)?",
        hint: "Deve essere conforme a JTC-24 prEN_18222. Verificare che sia serializzato a livello di singola batteria.",
        ref: "Art. 77(3); JTC-24 prEN_18222 (4.2)",
      },
      {
        id: "id_battery",
        text: "Il Battery Identifier è conforme agli standard ISO/IEC 15459 e presente sull'etichetta fisica?",
        hint: "Include serial number, batch o product number. Deve comparire sull'etichetta o imballaggio se la dimensione non lo consente sulla batteria.",
        ref: "Art. 77(3); Art. 3(66)",
      },
      {
        id: "id_manufacturer",
        text: "Le informazioni sul produttore sono complete (nome, indirizzo, web, email)?",
        hint: "Includono ragione sociale, trademark registrato, indirizzo postale, contatti. Devono essere in lingua comprensibile all'utente finale.",
        ref: "Annex VI Part A (1); Art. 38(7)",
      },
      {
        id: "id_operator",
        text: "È presente l'Economic Operator Identifier (se diverso dal produttore)?",
        hint: "Obbligatorio per ESPR se diverso dal manufacturer. Se non disponibile, deve essere richiesto dall'operatore.",
        ref: "ESPR Art. 12(2); Art. 3(22)",
      },
      {
        id: "id_facility",
        text: "È presente il Facility Identifier univoco per il sito di produzione?",
        hint: "Identifica univocamente il luogo di produzione secondo JTC-24 prEN_18219.",
        ref: "JTC-24 prEN_18219 (3.20)",
      },
    ],
  },
  {
    id: "performance",
    code: "B",
    title: "Performance & Durability",
    subtitle: "Capacità, energia, resistenza, lifetime, temperatura, eventi negativi",
    totalAttributes: 42,
    regulation: "Annex IV BattReg; Delegated Acts (in definizione)",
    keyAttributes: [
      "Capacità nominale e minima garantita (Ah)",
      "Energia nominale (Wh)",
      "State of Health (SoH)",
      "State of Charge (SoC) — dinamico",
      "Remaining Capacity — dinamico",
      "Resistenza interna originale e attuale",
      "Round-trip energy efficiency",
      "Numero cicli di carica/scarica",
      "Temperatura operativa (min/max)",
      "Deep discharge & overcharge events",
    ],
    mandatoryEV: 38,
    voluntaryEV: 4,
    questions: [
      {
        id: "perf_capacity",
        text: "Sono documentati capacità nominale (Ah), energia nominale (Wh) e tensione (V) con valori certificati?",
        hint: "Inclusi valori minimi garantiti e metodologia di misura. Attributi statici, a livello di modello.",
        ref: "Annex IV; IEC 62619",
      },
      {
        id: "perf_soh",
        text: "Esiste un sistema per calcolare e aggiornare State of Health (SoH) e Remaining Capacity?",
        hint: "Sono attributi dinamici. La frequenza di aggiornamento sarà definita da Delegated Act. Verificare presenza di BMS o equivalente.",
        ref: "Annex IV; Delegated Act (in def.)",
      },
      {
        id: "perf_resistance",
        text: "È documentata la resistenza interna (originale + attuale) con metodo di misura?",
        hint: "La resistenza interna originale è statica; quella attuale è dinamica. Entrambe obbligatorie per EV.",
        ref: "Annex IV BattReg",
      },
      {
        id: "perf_lifetime",
        text: "Sono tracciati i dati di lifetime: cicli, energy throughput, capacity throughput?",
        hint: "Attributi dinamici critici. Includono numero di cicli completi, throughput totale di energia e capacità.",
        ref: "Annex IV; Delegated Act",
      },
      {
        id: "perf_temperature",
        text: "Sono monitorate le condizioni di temperatura (range operativo + eventi estremi)?",
        hint: "Include range nominale, tempo trascorso sopra/sotto soglia, tempo di ricarica in temperature estreme.",
        ref: "Annex IV BattReg",
      },
      {
        id: "perf_events",
        text: "Vengono registrati e documentati gli eventi negativi (deep discharge, overcharge, incidenti)?",
        hint: "Numero eventi di scarica profonda, sovraccarica, e informazioni su incidenti. Tutti dinamici.",
        ref: "Annex IV BattReg",
      },
    ],
  },
  {
    id: "carbon",
    code: "C",
    title: "Battery Carbon Footprint",
    subtitle: "Impronta carbonica del ciclo di vita e soglie GHG",
    totalAttributes: 8,
    regulation: "Art. 7 BattReg; Reg. (UE) 2023/1542; DA Carbon Footprint",
    keyAttributes: [
      "Carbon footprint totale (kg CO₂eq / kWh)",
      "Dichiarazione di carbon footprint (Battery CF Declaration)",
      "Classe di performance carbon footprint",
      "Soglia massima carbon footprint (threshold)",
      "Carbon footprint per fase del ciclo di vita",
      "Share di energia rinnovabile nel processo",
    ],
    mandatoryEV: 8,
    voluntaryEV: 0,
    questions: [
      {
        id: "cf_declaration",
        text: "È stata preparata o è in corso la Battery Carbon Footprint Declaration secondo l'Art. 7?",
        hint: "Obbligatoria per EV. Include la CF totale in kg CO₂eq/kWh e la CF per fase del ciclo di vita (estrazione, produzione, fine vita).",
        ref: "Art. 7 BattReg; Annex II",
      },
      {
        id: "cf_class",
        text: "È stata calcolata la classe di performance della carbon footprint (A–E)?",
        hint: "Le classi saranno definite da Delegated Act. Verificare se l'azienda ha già una stima comparativa.",
        ref: "Art. 7(1)(d); DA CF",
      },
      {
        id: "cf_lifecycle",
        text: "Esiste un LCA completo con dettaglio per fase (raw material, manufacturing, use, EoL)?",
        hint: "Necessario per il calcolo disaggregato della CF. Deve seguire la metodologia definita dal DA.",
        ref: "Art. 7; DA Metodologia LCA",
      },
      {
        id: "cf_renewable",
        text: "È documentata e verificabile la quota di energia rinnovabile usata nel processo produttivo?",
        hint: "Influenza direttamente il valore di carbon footprint. Deve essere dimostrabile con evidenze (GO, contratti energia).",
        ref: "Art. 7 BattReg",
      },
    ],
  },
  {
    id: "materials",
    code: "D",
    title: "Battery Materials & Composition",
    subtitle: "Sostanze pericolose, materiali critici, composizione chimica",
    totalAttributes: 5,
    regulation: "Art. 13 BattReg; REACH; RoHS",
    keyAttributes: [
      "Composizione chimica della batteria (catodo, anodo, elettrolita)",
      "Sostanze pericolose presenti (> soglie REACH)",
      "Materiali critici (litio, cobalto, nichel, manganese)",
      "Specifiche chimia: LFP, NMC, NCA, LTO ecc.",
    ],
    mandatoryEV: 5,
    voluntaryEV: 0,
    questions: [
      {
        id: "mat_chemistry",
        text: "È documentata la composizione chimica dettagliata (catodo, anodo, elettrolita, involucro)?",
        hint: "Include il tipo di chimica (NMC, LFP, NCA, ecc.) e le percentuali in peso dei materiali principali.",
        ref: "Art. 13 BattReg; Annex VI",
      },
      {
        id: "mat_hazardous",
        text: "Sono identificate e dichiarate tutte le sostanze pericolose presenti sopra le soglie REACH/RoHS?",
        hint: "Include metalli pesanti, solventi dell'elettrolita, additivi. Verifica SVHC list ECHA.",
        ref: "Art. 13(4); REACH Art. 59",
      },
      {
        id: "mat_critical",
        text: "Sono tracciate e documentate le quantità di materiali critici (Li, Co, Ni, Mn, grafite)?",
        hint: "Necessario anche per il calcolo del contenuto riciclato (sezione Circularity). Devono essere indicati in % peso.",
        ref: "Art. 13 BattReg; EU CRM List",
      },
    ],
  },
  {
    id: "circularity",
    code: "E",
    title: "Circularity & Resource Efficiency",
    subtitle: "Contenuto riciclato, design for disassembly, fine vita",
    totalAttributes: 15,
    regulation: "Art. 8, 11, 60-76 BattReg; End-of-Life DA",
    keyAttributes: [
      "Contenuto riciclato di Co, Li, Ni, Pb (% in peso)",
      "Contenuto rinnovabile",
      "Design for disassembly (istruzioni smontaggio)",
      "Istruzioni raccolta e preparazione second life",
      "Rimovibilità e sostituibilità",
      "Informazioni su trattamento a fine vita",
      "Parts availability (spare parts)",
    ],
    mandatoryEV: 12,
    voluntaryEV: 3,
    questions: [
      {
        id: "circ_recycled",
        text: "È documentato e verificabile il contenuto riciclato di cobalto, litio, nichel e piombo (% in peso)?",
        hint: "Soglie minime obbligatorie definite dall'Art. 8: Co ≥16%, Li ≥6%, Ni ≥6% dal 2031. Devono essere calcolate secondo metodologia DA.",
        ref: "Art. 8 BattReg; DA Recycled Content",
      },
      {
        id: "circ_disassembly",
        text: "Esistono istruzioni di disassemblaggio per riutilizzo, rigenerazione e riciclo?",
        hint: "Devono coprire pack, moduli e celle. Includono sequenza operativa, utensili necessari, rischi di sicurezza.",
        ref: "Art. 11 BattReg; Annex XIII",
      },
      {
        id: "circ_secondlife",
        text: "Sono disponibili informazioni per il second life (SoH attuale, capacità residua, test necessari)?",
        hint: "Include stato di salute attuale, capacity residua, procedure per test pre-second-life. Attributi dinamici.",
        ref: "Art. 60-76 BattReg",
      },
      {
        id: "circ_eol",
        text: "Sono documentate le istruzioni per la raccolta, il trattamento e il riciclo a fine vita?",
        hint: "Incluse istruzioni per utenti finali (consumer), istruzioni per impianti di trattamento, obiettivi di recupero.",
        ref: "Art. 60(2); Annex XIII",
      },
    ],
  },
  {
    id: "supplychain",
    code: "F",
    title: "Supply Chain Due Diligence",
    subtitle: "Tracciabilità catena di fornitura e materiali critici",
    totalAttributes: 3,
    regulation: "Art. 48-52 BattReg; OECD DD Guidelines",
    keyAttributes: [
      "Supply chain due diligence report",
      "Politica aziendale di due diligence",
      "Identificazione e gestione dei rischi nella supply chain",
    ],
    mandatoryEV: 3,
    voluntaryEV: 0,
    questions: [
      {
        id: "sc_policy",
        text: "L'azienda ha adottato una politica formale di supply chain due diligence per i materiali critici?",
        hint: "Deve coprire almeno Li, Co, Ni, Mn, grafite naturale. Allineata alle OECD DD Guidelines.",
        ref: "Art. 48 BattReg; OECD Guidelines",
      },
      {
        id: "sc_report",
        text: "Viene redatto e reso disponibile un report annuale di supply chain due diligence?",
        hint: "Include mappatura fornitori, valutazione dei rischi (conflitto, diritti umani, ambiente), misure di mitigazione adottate.",
        ref: "Art. 52 BattReg",
      },
      {
        id: "sc_traceability",
        text: "È tracciabile l'origine dei materiali critici fino al sito di estrazione/lavorazione primaria?",
        hint: "Livello di tracciabilità richiesto: almeno fino al primo fornitore diretto, con audit o certificazioni di terza parte.",
        ref: "Art. 48-52 BattReg",
      },
    ],
  },
  {
    id: "labels",
    code: "G",
    title: "Symbols, Labels & Conformity",
    subtitle: "Etichettatura, QR code, marcatura CE e dichiarazioni",
    totalAttributes: 7,
    regulation: "Art. 13, 14, 38-40 BattReg; Annex VI/VII",
    keyAttributes: [
      "QR code con link al Battery Passport",
      "Marcatura CE",
      "Simbolo 'separate collection' (bidone barrato)",
      "Dichiarazione di conformità (DoC)",
      "Capacità (Wh) sull'etichetta",
      "Codice colore per hazardous substances",
    ],
    mandatoryEV: 7,
    voluntaryEV: 0,
    questions: [
      {
        id: "lab_qr",
        text: "Il QR code è presente sulla batteria (o imballaggio) e collega al Battery Passport con accesso pubblico?",
        hint: "Obbligatorio. Il QR deve essere leggibile per tutta la vita utile della batteria. Deve linkare a un URL persistente.",
        ref: "Art. 13(3); Art. 77(3)",
      },
      {
        id: "lab_ce",
        text: "La marcatura CE è presente e la Dichiarazione di Conformità (DoC) è disponibile?",
        hint: "La DoC deve essere aggiornata e accessibile. Include riferimenti alle norme armonizzate applicabili.",
        ref: "Art. 38-40 BattReg; Annex VII",
      },
      {
        id: "lab_symbols",
        text: "Sono presenti tutti i simboli obbligatori (bidone barrato, capacità Wh, codice chimia, hazardous symbols)?",
        hint: "Verificare dimensioni minime simboli (Annex VI), leggibilità, permanenza sull'etichetta per tutta la vita utile.",
        ref: "Art. 13; Annex VI BattReg",
      },
    ],
  },
];

// ─── TYPES ───────────────────────────────────────────────────────────────────

const MATURITY = ["complete", "partial", "absent"];

const maturityConfig = {
  complete: { label: "Completo", points: 0, color: "#059669", bg: "#d1fae5", border: "#6ee7b7" },
  partial:  { label: "Parziale", points: 1, color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
  absent:   { label: "Assente",  points: 2, color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function computeScores(answers) {
  const results = {};
  CATEGORIES.forEach((cat) => {
    const qs = cat.questions;
    let total = 0;
    let answered = 0;
    qs.forEach((q) => {
      const val = answers[q.id];
      if (val) {
        total += maturityConfig[val].points;
        answered++;
      }
    });
    const maxPossible = qs.length * 2;
    const pct = maxPossible > 0 ? Math.round((1 - total / maxPossible) * 100) : 0;
    const label = pct >= 75 ? "Buona" : pct >= 40 ? "Intermedia" : "Critica";
    results[cat.id] = { total, answered, maxPossible, pct, label };
  });
  return results;
}

function overallScore(scores) {
  let sum = 0; let max = 0;
  Object.values(scores).forEach((s) => { sum += s.total; max += s.maxPossible; });
  const pct = max > 0 ? Math.round((1 - sum / max) * 100) : 0;
  return { pct, label: pct >= 75 ? "Buona" : pct >= 40 ? "Intermedia" : "Critica" };
}

function badgeStyle(label) {
  if (label === "Buona")       return { background: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" };
  if (label === "Intermedia")  return { background: "#fef3c7", color: "#78350f", border: "1px solid #fcd34d" };
  return                              { background: "#fee2e2", color: "#7f1d1d", border: "1px solid #fca5a5" };
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function BatteryPassportScreening() {
  const [phase, setPhase] = useState("intro"); // intro | category | results
  const [catIndex, setCatIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [expandedGap, setExpandedGap] = useState(null);

  const scores = useMemo(() => computeScores(answers), [answers]);
  const overall = useMemo(() => overallScore(scores), [scores]);

  const currentCat = CATEGORIES[catIndex];
  const totalSteps = CATEGORIES.length;
  const progress = Math.round(((catIndex + 1) / totalSteps) * 100);

  function setAnswer(qId, val) {
    setAnswers((p) => ({ ...p, [qId]: val }));
  }

  function goNext() {
    if (catIndex < CATEGORIES.length - 1) {
      setCatIndex(catIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPhase("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goPrev() {
    if (catIndex > 0) {
      setCatIndex(catIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPhase("intro");
    }
  }

  function restart() {
    setAnswers({});
    setCatIndex(0);
    setPhase("intro");
  }

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div style={styles.root}>
        <div style={styles.container}>
          <div style={styles.introBadge}>Battery Passport EU · BattReg 2023/1542</div>
          <h1 style={styles.introTitle}>Battery Passport<br />Readiness Screening</h1>
          <p style={styles.introSub}>
            Strumento di pre-assessment per consulenti e auditor. Valuta la maturità di un'azienda rispetto agli obblighi del Battery Passport EU, 
            organizzato nelle 7 macro-categorie del Data Attribute Longlist (BatteryPass-Ready v1.3).
          </p>

          <div style={styles.introGrid}>
            {CATEGORIES.map((cat) => (
              <div key={cat.id} style={styles.introCard}>
                <div style={styles.introCardCode}>{cat.code}</div>
                <div style={styles.introCardTitle}>{cat.title}</div>
                <div style={styles.introCardSub}>{cat.totalAttributes} attributi · {cat.mandatoryEV} obbligatori EV</div>
              </div>
            ))}
          </div>

          <div style={styles.introMeta}>
            <div style={styles.metaItem}><span style={styles.metaDot} />Batterie EV (veicoli elettrici)</div>
            <div style={styles.metaItem}><span style={styles.metaDot} />99 attributi totali coperti</div>
            <div style={styles.metaItem}><span style={styles.metaDot} />Circa 10–15 minuti</div>
          </div>

          <button style={styles.startBtn} onClick={() => setPhase("category")}>
            Avvia screening →
          </button>

          <p style={styles.disclaimer}>
            Screening preliminare. Non sostituisce audit formali, certificazioni o consulenza legale.
          </p>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  if (phase === "results") {
    const gapItems = [];
    CATEGORIES.forEach((cat) => {
      cat.questions.forEach((q) => {
        const val = answers[q.id];
        if (val === "partial" || val === "absent" || !val) {
          gapItems.push({ cat: cat.title, catCode: cat.code, q, val: val || "absent" });
        }
      });
    });

    const criticalGaps = gapItems.filter((g) => g.val === "absent");
    const partialGaps = gapItems.filter((g) => g.val === "partial");

    return (
      <div style={styles.root}>
        <div style={styles.container}>
          {/* Header risultati */}
          <div style={styles.resultsHeader}>
            <div>
              <div style={styles.introBadge}>Risultati screening</div>
              <h2 style={styles.resultsTitle}>Gap Analysis — Battery Passport</h2>
            </div>
            <button style={styles.restartBtn} onClick={restart}>← Nuovo screening</button>
          </div>

          {/* Overall score */}
          <div style={styles.overallCard}>
            <div style={styles.overallLeft}>
              <div style={styles.overallLabel}>Maturità complessiva</div>
              <div style={{ ...styles.overallBadge, ...badgeStyle(overall.label) }}>{overall.label}</div>
              <div style={styles.overallPct}>{overall.pct}%</div>
              <div style={styles.overallSub}>degli attributi coperti o parzialmente coperti</div>
            </div>
            <div style={styles.overallRight}>
              <div style={styles.overallStat}>
                <span style={{ ...styles.statNum, color: "#dc2626" }}>{criticalGaps.length}</span>
                <span style={styles.statLab}>gap critici (Assente)</span>
              </div>
              <div style={styles.overallStat}>
                <span style={{ ...styles.statNum, color: "#d97706" }}>{partialGaps.length}</span>
                <span style={styles.statLab}>gap parziali</span>
              </div>
              <div style={styles.overallStat}>
                <span style={{ ...styles.statNum, color: "#059669" }}>{Object.values(answers).filter(v => v === "complete").length}</span>
                <span style={styles.statLab}>aree conformi</span>
              </div>
            </div>
          </div>

          {/* Score per categoria */}
          <div style={styles.sectionTitle}>Maturità per categoria</div>
          <div style={styles.catScoreGrid}>
            {CATEGORIES.map((cat) => {
              const s = scores[cat.id];
              return (
                <div key={cat.id} style={styles.catScoreCard}>
                  <div style={styles.catScoreTop}>
                    <span style={styles.catScoreCode}>{cat.code}</span>
                    <span style={styles.catScoreName}>{cat.title}</span>
                    <span style={{ ...styles.catScoreBadge, ...badgeStyle(s.label) }}>{s.label}</span>
                  </div>
                  <div style={styles.barOuter}>
                    <div style={{ ...styles.barInner, width: `${s.pct}%`, background: s.pct >= 75 ? "#059669" : s.pct >= 40 ? "#d97706" : "#dc2626" }} />
                  </div>
                  <div style={styles.catScorePct}>{s.pct}% copertura · {s.answered}/{cat.questions.length} domande</div>
                </div>
              );
            })}
          </div>

          {/* Gap critici */}
          {criticalGaps.length > 0 && (
            <>
              <div style={styles.sectionTitle}>
                <span style={{ color: "#dc2626" }}>●</span> Gap critici — da colmare con priorità
              </div>
              <div style={styles.gapList}>
                {criticalGaps.map((g, i) => (
                  <GapItem key={i} g={g} expanded={expandedGap === `absent-${i}`} onToggle={() => setExpandedGap(expandedGap === `absent-${i}` ? null : `absent-${i}`)} color="#dc2626" bgColor="#fff5f5" />
                ))}
              </div>
            </>
          )}

          {/* Gap parziali */}
          {partialGaps.length > 0 && (
            <>
              <div style={styles.sectionTitle}>
                <span style={{ color: "#d97706" }}>●</span> Gap parziali — da strutturare e formalizzare
              </div>
              <div style={styles.gapList}>
                {partialGaps.map((g, i) => (
                  <GapItem key={i} g={g} expanded={expandedGap === `partial-${i}`} onToggle={() => setExpandedGap(expandedGap === `partial-${i}` ? null : `partial-${i}`)} color="#d97706" bgColor="#fffbeb" />
                ))}
              </div>
            </>
          )}

          {gapItems.length === 0 && (
            <div style={styles.allGoodBox}>
              ✓ Nessun gap rilevato. La copertura degli attributi risulta completa per le aree valutate.
            </div>
          )}

          <p style={styles.disclaimer}>
            Questo screening è preliminare e non sostituisce un audit formale, una certificazione di terza parte o una consulenza legale. 
            I riferimenti normativi si basano sul BattReg (UE) 2023/1542 e sui draft JTC-24 (stato: dicembre 2025).
          </p>
        </div>
      </div>
    );
  }

  // ── CATEGORY STEP ──
  const catAnswered = currentCat.questions.filter((q) => answers[q.id]).length;
  const catTotal = currentCat.questions.length;

  return (
    <div style={styles.root}>
      <div style={styles.container}>

        {/* Top bar */}
        <div style={styles.topBar}>
          <div>
            <div style={styles.introBadge}>Battery Passport Screening</div>
            <div style={styles.stepLabel}>Sezione {catIndex + 1} di {totalSteps} — {currentCat.title}</div>
          </div>
          <div style={styles.progressRight}>
            <div style={styles.progressPct}>{progress}%</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressOuter}>
          <div style={{ ...styles.progressInner, width: `${progress}%` }} />
        </div>

        {/* Step tabs */}
        <div style={styles.stepTabs}>
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              style={{
                ...styles.stepTab,
                ...(i === catIndex ? styles.stepTabActive : {}),
                ...(i < catIndex ? styles.stepTabDone : {}),
              }}
              onClick={() => setCatIndex(i)}
            >
              {cat.code}
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div style={styles.mainGrid}>
          {/* Questions */}
          <div style={styles.mainLeft}>
            <div style={styles.catHeader}>
              <div style={styles.catCode}>{currentCat.code}</div>
              <div>
                <div style={styles.catTitle}>{currentCat.title}</div>
                <div style={styles.catSubtitle}>{currentCat.subtitle}</div>
                <div style={styles.catRegRef}>{currentCat.regulation}</div>
              </div>
            </div>

            <div style={styles.keyAttrsBox}>
              <div style={styles.keyAttrsTitle}>Attributi chiave coperti da questa sezione</div>
              <ul style={styles.keyAttrsList}>
                {currentCat.keyAttributes.map((a, i) => <li key={i} style={styles.keyAttrItem}>{a}</li>)}
              </ul>
            </div>

            <div style={styles.questionStack}>
              {currentCat.questions.map((q, qi) => (
                <QuestionCard key={q.id} q={q} qi={qi} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
              ))}
            </div>

            {/* Nav */}
            <div style={styles.navRow}>
              <button style={styles.btnSecondary} onClick={goPrev}>← Indietro</button>
              <div style={styles.navCenter}>{catAnswered}/{catTotal} domande</div>
              <button style={styles.btnPrimary} onClick={goNext}>
                {catIndex < CATEGORIES.length - 1 ? "Avanti →" : "Vedi risultati →"}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <div style={styles.sideCard}>
              <div style={styles.sideCardTitle}>Riepilogo live</div>
              {CATEGORIES.map((cat, i) => {
                const s = scores[cat.id];
                return (
                  <div key={cat.id} style={{ ...styles.sideRow, ...(i === catIndex ? styles.sideRowActive : {}) }}>
                    <span style={styles.sideRowCode}>{cat.code}</span>
                    <span style={styles.sideRowName}>{cat.title.split(" ")[0]}</span>
                    <span style={{ ...styles.sideBadge, ...badgeStyle(s.label) }}>{s.label}</span>
                  </div>
                );
              })}
            </div>

            <div style={styles.sideCard}>
              <div style={styles.sideCardTitle}>Score complessivo</div>
              <div style={{ ...styles.overallBadge, ...badgeStyle(overall.label), display: "inline-flex", marginTop: 4 }}>{overall.label}</div>
              <div style={{ marginTop: 8, fontSize: 13, color: "#64748b" }}>{overall.pct}% copertura media</div>
              <div style={styles.barOuter}>
                <div style={{ ...styles.barInner, width: `${overall.pct}%`, background: overall.pct >= 75 ? "#059669" : overall.pct >= 40 ? "#d97706" : "#dc2626" }} />
              </div>
            </div>

            <button style={{ ...styles.btnPrimary, width: "100%" }} onClick={() => { setPhase("results"); window.scrollTo({ top: 0 }); }}>
              Vai ai risultati →
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function QuestionCard({ q, qi, value, onChange }) {
  const [showHint, setShowHint] = useState(false);
  return (
    <div style={{ ...styles.qCard, ...(value ? styles.qCardAnswered : {}) }}>
      <div style={styles.qTop}>
        <div style={styles.qNum}>Q{qi + 1}</div>
        <div style={styles.qRef}>{q.ref}</div>
      </div>
      <div style={styles.qText}>{q.text}</div>

      <div style={styles.triRow}>
        {MATURITY.map((m) => {
          const cfg = maturityConfig[m];
          const selected = value === m;
          return (
            <button
              key={m}
              onClick={() => onChange(m)}
              style={{
                ...styles.triBtn,
                ...(selected ? { borderColor: cfg.color, background: cfg.bg, color: cfg.color } : {}),
              }}
            >
              <div style={styles.triBtnLabel}>{cfg.label}</div>
              <div style={styles.triBtnHint}>
                {m === "complete" ? "Strutturato e documentato" : m === "partial" ? "Presente ma non sistematico" : "Non disponibile"}
              </div>
            </button>
          );
        })}
      </div>

      <div style={styles.hintToggle} onClick={() => setShowHint(!showHint)}>
        {showHint ? "▲ Nascondi nota" : "▼ Nota per l'auditor"}
      </div>
      {showHint && <div style={styles.hintBox}>{q.hint}</div>}
    </div>
  );
}

function GapItem({ g, expanded, onToggle, color, bgColor }) {
  return (
    <div style={{ ...styles.gapCard, borderLeftColor: color, background: bgColor }}>
      <div style={styles.gapTop} onClick={onToggle}>
        <div style={styles.gapLeft}>
          <span style={{ ...styles.gapCode, color }}>{g.catCode}</span>
          <span style={styles.gapText}>{g.q.text}</span>
        </div>
        <div style={{ ...styles.gapStatus, color }}>{g.val === "absent" ? "Assente" : "Parziale"} {expanded ? "▲" : "▼"}</div>
      </div>
      {expanded && (
        <div style={styles.gapDetail}>
          <div style={styles.gapCat}>Categoria: {g.cat}</div>
          <div style={styles.gapHint}><strong>Nota auditor:</strong> {g.q.hint}</div>
          <div style={styles.gapRef}><strong>Riferimento:</strong> {g.q.ref}</div>
        </div>
      )}
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    color: "#0f172a",
  },
  container: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "40px 24px 80px",
  },

  // Intro
  introBadge: {
    display: "inline-block",
    background: "#e0f2fe",
    color: "#0369a1",
    border: "1px solid #bae6fd",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "3px 10px",
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
    color: "#0f172a",
    marginBottom: 16,
  },
  introSub: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 1.7,
    maxWidth: 600,
    marginBottom: 36,
  },
  introGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 12,
    marginBottom: 32,
  },
  introCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "16px 18px",
  },
  introCardCode: {
    width: 28,
    height: 28,
    background: "#0f172a",
    color: "#fff",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },
  introCardTitle: { fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 4 },
  introCardSub: { fontSize: 11, color: "#94a3b8" },
  introMeta: { display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" },
  metaItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569" },
  metaDot: { width: 6, height: 6, borderRadius: "50%", background: "#0369a1", display: "inline-block" },
  startBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "14px 32px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 24,
  },
  disclaimer: { fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginTop: 16 },

  // Step
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  stepLabel: { fontSize: 16, fontWeight: 600, color: "#0f172a", marginTop: 8 },
  progressRight: { textAlign: "right" },
  progressPct: { fontSize: 22, fontWeight: 700, color: "#0f172a" },
  progressOuter: { height: 4, background: "#e2e8f0", borderRadius: 2, marginBottom: 20 },
  progressInner: { height: 4, background: "#0f172a", borderRadius: 2, transition: "width 0.3s" },
  stepTabs: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  stepTab: {
    width: 36, height: 36, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 600,
    background: "#f1f5f9", color: "#94a3b8",
    border: "1px solid #e2e8f0", cursor: "pointer",
  },
  stepTabActive: { background: "#0f172a", color: "#fff", borderColor: "#0f172a" },
  stepTabDone: { background: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" },

  // Main grid
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" },
  mainLeft: {},

  catHeader: { display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 },
  catCode: {
    width: 44, height: 44, background: "#0f172a", color: "#fff",
    borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 700, flexShrink: 0,
  },
  catTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a" },
  catSubtitle: { fontSize: 13, color: "#64748b", marginTop: 2 },
  catRegRef: { fontSize: 11, color: "#94a3b8", marginTop: 4 },

  keyAttrsBox: {
    background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8,
    padding: "12px 16px", marginBottom: 20,
  },
  keyAttrsTitle: { fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 },
  keyAttrsList: { margin: 0, paddingLeft: 18 },
  keyAttrItem: { fontSize: 12, color: "#475569", marginBottom: 3 },

  questionStack: { display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 },
  qCard: {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 10, padding: "18px 20px",
  },
  qCardAnswered: { borderColor: "#cbd5e1" },
  qTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  qNum: { fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" },
  qRef: { fontSize: 10, color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4 },
  qText: { fontSize: 14, fontWeight: 500, color: "#0f172a", lineHeight: 1.5, marginBottom: 14 },

  triRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 },
  triBtn: {
    border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px",
    background: "#fff", cursor: "pointer", textAlign: "left",
    transition: "all 0.15s",
  },
  triBtnLabel: { fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 3 },
  triBtnHint: { fontSize: 11, color: "#94a3b8", lineHeight: 1.4 },

  hintToggle: { fontSize: 12, color: "#0369a1", cursor: "pointer", userSelect: "none" },
  hintBox: {
    marginTop: 10, background: "#f0f9ff", border: "1px solid #bae6fd",
    borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#0c4a6e", lineHeight: 1.6,
  },

  navRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  navCenter: { fontSize: 13, color: "#94a3b8" },
  btnPrimary: {
    background: "#0f172a", color: "#fff", border: "none",
    borderRadius: 7, padding: "11px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer",
  },
  btnSecondary: {
    background: "#fff", color: "#475569", border: "1px solid #e2e8f0",
    borderRadius: 7, padding: "11px 22px", fontSize: 14, fontWeight: 500, cursor: "pointer",
  },

  // Sidebar
  sidebar: { display: "flex", flexDirection: "column", gap: 16 },
  sideCard: {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 10, padding: "16px",
  },
  sideCardTitle: { fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 },
  sideRow: {
    display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
    borderRadius: 6, marginBottom: 2,
  },
  sideRowActive: { background: "#f1f5f9" },
  sideRowCode: { fontSize: 11, fontWeight: 700, color: "#94a3b8", width: 16 },
  sideRowName: { fontSize: 12, color: "#475569", flex: 1 },
  sideBadge: {
    fontSize: 10, fontWeight: 600, padding: "2px 7px",
    borderRadius: 4, whiteSpace: "nowrap",
  },

  barOuter: { height: 4, background: "#e2e8f0", borderRadius: 2, marginTop: 8 },
  barInner: { height: 4, borderRadius: 2, transition: "width 0.4s" },

  // Results
  resultsHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  resultsTitle: { fontSize: 28, fontWeight: 700, color: "#0f172a", marginTop: 8 },
  restartBtn: {
    background: "#fff", color: "#475569", border: "1px solid #e2e8f0",
    borderRadius: 7, padding: "9px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer",
  },

  overallCard: {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
    padding: "28px 32px", display: "flex", gap: 48, alignItems: "center", marginBottom: 32,
  },
  overallLeft: {},
  overallRight: { display: "flex", flexDirection: "column", gap: 16 },
  overallLabel: { fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 },
  overallBadge: {
    display: "inline-flex", alignItems: "center",
    fontSize: 14, fontWeight: 700, padding: "6px 14px",
    borderRadius: 8, marginBottom: 8,
  },
  overallPct: { fontSize: 36, fontWeight: 800, color: "#0f172a" },
  overallSub: { fontSize: 13, color: "#64748b" },
  overallStat: { display: "flex", alignItems: "baseline", gap: 8 },
  statNum: { fontSize: 28, fontWeight: 800 },
  statLab: { fontSize: 13, color: "#64748b" },

  sectionTitle: {
    fontSize: 15, fontWeight: 700, color: "#0f172a",
    margin: "28px 0 14px", display: "flex", alignItems: "center", gap: 8,
  },
  catScoreGrid: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 },
  catScoreCard: {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 9, padding: "14px 18px",
  },
  catScoreTop: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  catScoreCode: { fontSize: 12, fontWeight: 700, color: "#94a3b8", width: 16 },
  catScoreName: { flex: 1, fontSize: 14, fontWeight: 500, color: "#0f172a" },
  catScoreBadge: { fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 5 },
  catScorePct: { fontSize: 11, color: "#94a3b8", marginTop: 6 },

  gapList: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 },
  gapCard: {
    borderLeft: "3px solid",
    borderRadius: "0 8px 8px 0",
    padding: "12px 16px",
    cursor: "pointer",
  },
  gapTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  gapLeft: { display: "flex", gap: 10, alignItems: "flex-start", flex: 1 },
  gapCode: { fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 },
  gapText: { fontSize: 13, color: "#1e293b", lineHeight: 1.5 },
  gapStatus: { fontSize: 11, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" },
  gapDetail: { marginTop: 12, paddingTop: 12, borderTop: "1px solid #e2e8f0" },
  gapCat: { fontSize: 11, color: "#94a3b8", marginBottom: 6 },
  gapHint: { fontSize: 12, color: "#475569", lineHeight: 1.6, marginBottom: 6 },
  gapRef: { fontSize: 11, color: "#0369a1" },

  allGoodBox: {
    background: "#d1fae5", border: "1px solid #6ee7b7",
    borderRadius: 8, padding: "16px 20px",
    fontSize: 14, color: "#065f46", fontWeight: 500,
  },
};
