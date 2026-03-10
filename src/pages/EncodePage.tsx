import { useState } from 'react'
import { toUTF8Bytes, toBinary } from '../utils/encoding'

export default function EncodePage() {
  const [text, setText] = useState('Héllo 🌍')

  const chars = [...text]

  const charData = chars.map((ch) => {
    const bytes = toUTF8Bytes(ch)
    const cp = ch.codePointAt(0)!
    return { ch, bytes, cp }
  })

  const allBytes = charData.flatMap((d) => d.bytes)
  const utf16Size =
    chars.reduce((s, ch) => s + (ch.codePointAt(0)! > 0xffff ? 4 : 2), 0) + 2
  const latin1Ok = chars.every((ch) => ch.codePointAt(0)! <= 255)

  return (
    <>
      <div className="card">
        <h2>► TEKST NAAR BYTES</h2>
        <label>VOER TEKST IN (probeer accenten, emoji&apos;s, andere talen)</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type hier..."
        />
        <div className="byte-grid">
          {charData.map(({ ch, bytes, cp }, i) => (
            <div
              key={i}
              className={'byte-cell' + (bytes.length > 1 ? ' multi-byte' : '')}
              title={`Karakter: ${ch}\nUnicode: U+${cp.toString(16).toUpperCase().padStart(4, '0')}\nUTF-8 bytes: ${bytes.map((b) => '0x' + b.toString(16).toUpperCase().padStart(2, '0')).join(', ')}\nAantal bytes: ${bytes.length}`}
            >
              <span className="char-label">{ch === ' ' ? '·' : ch}</span>
              <span className="hex-val">
                {bytes.map((b) => b.toString(16).toUpperCase().padStart(2, '0')).join(' ')}
              </span>
              <span className="dec-val">U+{cp.toString(16).toUpperCase().padStart(4, '0')}</span>
              <span className="bin-val">
                {bytes.length === 1 ? toBinary(bytes[0]) : bytes.length + 'B'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="row-pair">
        <div className="card">
          <h2>► UTF-8 BYTES</h2>
          <div className="output-block">
            {text ? (
              <>
                {allBytes.map((b, i) => (
                  <span key={i} style={{ color: 'var(--amber)' }}>
                    0x{b.toString(16).toUpperCase().padStart(2, '0')}{' '}
                  </span>
                ))}
                <br />
                <br />
                <span style={{ color: 'var(--green-dim)' }}>
                  {allBytes.length} bytes totaal voor {chars.length} karakter(s)
                </span>
              </>
            ) : (
              '...'
            )}
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--green-dim)' }}>
            <span className="info-pill">1 byte = ASCII</span>
            <span className="info-pill">2-4 bytes = Unicode</span>
          </div>
        </div>

        <div className="card">
          <h2>► UNICODE CODEPOINTS</h2>
          <div className="output-block">
            {charData.map(({ ch, bytes, cp }, i) => (
              <span key={i}>
                {bytes.length === 1 ? (
                  <span className="tag-label tag-utf8">1B</span>
                ) : (
                  <span className="tag-label tag-unicode">{bytes.length}B</span>
                )}
                <span className="unicode-point">
                  {' '}U+{cp.toString(16).toUpperCase().padStart(4, '0')}
                </span>{' '}
                <span style={{ color: 'var(--green)' }}>{ch}</span>{' '}
                <span style={{ color: 'var(--green-dim)', fontSize: '0.75rem' }}>(dec: {cp})</span>
                <br />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>► ENCODING VERGELIJKING</h2>
        <div className="output-block" style={{ fontFamily: 'monospace' }}>
          <span style={{ color: 'var(--green-dim)' }}>Encoding{'     '}Bytes{'    '}Status</span>
          <br />
          ─────────────────────────────
          <br />
          <span className="status-ok">
            UTF-8{'        '}
            {String(allBytes.length).padEnd(5, ' ')}{'  '}
            {allBytes.length} byte(s)
          </span>
          <br />
          <span className="status-ok">
            UTF-16{'       '}
            {String(utf16Size).padEnd(5, ' ')}{'  '}
            {utf16Size} byte(s) incl. BOM
          </span>
          <br />
          {latin1Ok ? (
            <span className="status-ok">
              Latin-1{'      '}
              {String(chars.length).padEnd(5, ' ')}{'  '}
              {chars.length} byte(s)
            </span>
          ) : (
            <span style={{ color: 'var(--red)' }}>
              ✗ Latin-1{'    '}—{'      '}Niet mogelijk (bevat tekens &gt; 255)
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--green-dim)', marginTop: '10px' }}>
          ⚠ Latin-1 ondersteunt geen emoji&apos;s of karakters buiten het Latijns alfabet
        </p>
      </div>
    </>
  )
}
