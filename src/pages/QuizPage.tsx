import { useState, useEffect, useRef } from 'react'

interface Question {
  q: string
  opts: string[]
  ans: number
  exp: string
}

const QUESTIONS: Question[] = [
  {
    q: "Een ASCII karakter 'A' heeft decimale waarde 65. Hoeveel bits zijn nodig om dit op te slaan?",
    opts: ['4 bits', '7 bits', '8 bits', '16 bits'],
    ans: 1,
    exp: 'ASCII gebruikt 7 bits (waarden 0–127). In de praktijk wordt een volledige byte (8 bits) gebruikt, maar de 8e bit is altijd 0 in standaard ASCII.',
  },
  {
    q: "Wat is de UTF-8 representatie van het karakter 'é' (U+00E9)?",
    opts: ['1 byte: 0xE9', '2 bytes: 0xC3 0xA9', '2 bytes: 0x00 0xE9', '4 bytes: 0xF0 0x00 0xE9 0x00'],
    ans: 1,
    exp: 'U+00E9 valt in het bereik U+0080–U+07FF en wordt in UTF-8 gecodeerd als 2 bytes: 0xC3 (11000011) en 0xA9 (10101001). De bits van E9 (1110 1001) worden verdeeld over beide bytes.',
  },
  {
    q: "Wat betekent 'mojibake'?",
    opts: [
      'Een Japanse encodingsstandaard',
      'Kapotte tekst door een mismatch tussen schrijf- en leesencoding',
      'Een type compressie-algoritme voor Unicode',
      'Een foutmelding in UTF-16',
    ],
    ans: 1,
    exp: "'Mojibake' (文字化け) is Japans voor 'getransformeerde letters'. Het ontstaat wanneer bytes die in encoding X zijn geschreven, worden gelezen als encoding Y, waardoor de tekens fout worden weergegeven.",
  },
  {
    q: 'Hoeveel bytes gebruikt UTF-8 voor een emoji zoals 🚀 (U+1F680)?',
    opts: ['1 byte', '2 bytes', '3 bytes', '4 bytes'],
    ans: 3,
    exp: "Codepoints U+10000 en hoger (zoals emoji's) vereisen 4 bytes in UTF-8. Dit is ook waarom MySQL's 'utf8' charset emoji's niet kan opslaan — het ondersteunt maar 3 bytes. Gebruik 'utf8mb4' voor emoji-ondersteuning.",
  },
  {
    q: 'Wat is het voordeel van UTF-8 boven UTF-32 voor Engelstalige tekst?',
    opts: [
      'UTF-8 ondersteunt meer Unicode tekens',
      'UTF-8 is sneller te verwerken',
      'ASCII tekens nemen slechts 1 byte in beplaats van 4 bytes',
      'UTF-8 heeft een vaste breedte per karakter',
    ],
    ans: 2,
    exp: 'UTF-32 gebruikt altijd 4 bytes per karakter. Voor ASCII tekens (A-Z, 0-9, ...) gebruikt UTF-8 slechts 1 byte. Een Engels woord van 5 letters is 5 bytes in UTF-8 maar 20 bytes in UTF-32. Daarom is UTF-8 de standaard op het web.',
  },
  {
    q: 'Waarom bevat een UTF-16 bestand vaak een BOM (Byte Order Mark)?',
    opts: [
      'Om de bestandsgrootte bij te houden',
      'Om aan te geven of bytes in little-endian of big-endian volgorde staan',
      'Om het bestand te beveiligen met een handtekening',
      'Om de taal van de tekst te markeren',
    ],
    ans: 1,
    exp: 'UTF-16 gebruikt 2 bytes per karakter. De BOM (U+FEFF) staat aan het begin en vertelt de lezer welke byte het hoogste is (big-endian: 0xFE 0xFF, of little-endian: 0xFF 0xFE). Zonder BOM kan de volgorde verkeerd worden geïnterpreteerd.',
  },
  {
    q: 'Welke HTML-tag is essentieel om encoding-problemen in browsers te voorkomen?',
    opts: [
      '<encoding type="utf-8">',
      '<meta charset="UTF-8">',
      '<html lang="utf-8">',
      '<header encoding="utf8">',
    ],
    ans: 1,
    exp: 'De tag <meta charset="UTF-8"> in de <head> vertelt de browser welke encoding te gebruiken bij het lezen van de pagina. Zonder deze tag kan de browser de verkeerde encoding raden, wat resulteert in kapotte tekst.',
  },
  {
    q: 'Welk bereik dekt de originele ASCII standaard?',
    opts: ['0–255 (8 bits)', '0–127 (7 bits)', '0–65535 (16 bits)', '0–1114111 (21 bits)'],
    ans: 1,
    exp: 'De originele ASCII standaard (1963) gebruikt 7 bits en dekt de waarden 0–127. Dit omvat Engelse letters, cijfers, leestekens en besturingstekens. Extended ASCII (IBM/Windows) breidde dit uit naar 8 bits (0–255) maar die extensies zijn niet gestandaardiseerd.',
  },
]

interface QuizState {
  current: number
  score: number
  answered: boolean
  selectedAnswer: number | null
  finished: boolean
}

function initialState(): QuizState {
  return { current: 0, score: 0, answered: false, selectedAnswer: null, finished: false }
}

export default function QuizPage() {
  const [state, setState] = useState<QuizState>(initialState)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function answerQuiz(idx: number) {
    if (state.answered) return

    const q = QUESTIONS[state.current]
    const correct = idx === q.ans

    setState((prev) => ({
      ...prev,
      answered: true,
      selectedAnswer: idx,
      score: correct ? prev.score + 1 : prev.score,
    }))

    timerRef.current = setTimeout(() => {
      setState((prev) => {
        const nextCurrent = prev.current + 1
        return {
          ...prev,
          current: nextCurrent,
          answered: false,
          selectedAnswer: null,
          finished: nextCurrent >= QUESTIONS.length,
        }
      })
    }, 2800)
  }

  function resetQuiz() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setState(initialState())
  }

  const progressWidth = state.finished
    ? '100%'
    : `${(state.current / QUESTIONS.length) * 100}%`

  if (state.finished) {
    const pct = Math.round((state.score / QUESTIONS.length) * 100)
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '✓' : '↺'
    return (
      <div className="card">
        <h2>► ENCODING QUIZ</h2>
        <div className="score-display">SCORE: {state.score} / {QUESTIONS.length}</div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: '100%' }} />
        </div>
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: '5rem', color: 'var(--amber)', textShadow: '0 0 20px rgba(255,170,0,0.4)', lineHeight: '1' }}>
            {emoji}
          </div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: '2.5rem', color: 'var(--green)', marginTop: '10px', textShadow: '0 0 12px var(--green)' }}>
            {state.score} / {QUESTIONS.length} CORRECT
          </div>
          <div style={{ color: 'var(--green-dim)', marginTop: '8px', fontSize: '0.9rem', letterSpacing: '2px' }}>
            {pct}% — {pct >= 80 ? 'UITSTEKEND' : pct >= 60 ? 'GOED BEZIG' : 'PROBEER OPNIEUW'}
          </div>
        </div>
        <button className="btn amber" onClick={resetQuiz} style={{ marginTop: '20px' }}>
          ↺ OPNIEUW
        </button>
      </div>
    )
  }

  const q = QUESTIONS[state.current]

  return (
    <div className="card">
      <h2>► ENCODING QUIZ</h2>
      <div className="score-display">SCORE: {state.score} / {QUESTIONS.length}</div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: progressWidth }} />
      </div>

      <div className="quiz-q">
        <span style={{ color: 'var(--green-dim)', fontSize: '0.78rem' }}>
          VRAAG {state.current + 1} VAN {QUESTIONS.length}
        </span>
        <br />
        <br />
        {q.q}
      </div>

      <div className="quiz-options">
        {q.opts.map((opt, i) => {
          let cls = 'quiz-opt'
          if (state.answered) {
            if (i === q.ans) cls += ' correct'
            else if (i === state.selectedAnswer) cls += ' wrong'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => answerQuiz(i)}
              disabled={state.answered}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          )
        })}
      </div>

      {state.answered && (
        <div className={`quiz-feedback ${state.selectedAnswer === q.ans ? 'ok' : 'err'}`}>
          {state.selectedAnswer === q.ans ? `✓ CORRECT — ${q.exp}` : `✗ FOUT — ${q.exp}`}
        </div>
      )}

      <button className="btn amber" onClick={resetQuiz} style={{ marginTop: '20px' }}>
        ↺ OPNIEUW
      </button>
    </div>
  )
}
