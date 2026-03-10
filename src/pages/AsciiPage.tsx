import { useState } from 'react'
import { toBinary } from '../utils/encoding'

const ASCII_NAMES: Record<number, string> = {
  0: 'NUL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL',
  8: 'BS', 9: 'TAB', 10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI',
  16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3', 20: 'DC4', 21: 'NAK', 22: 'SYN',
  23: 'ETB', 24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS',
  30: 'RS', 31: 'US', 32: 'SPACE', 127: 'DEL',
}

export default function AsciiPage() {
  const [filter, setFilter] = useState('')

  const fl = filter.toLowerCase()

  const rows: { i: number; ch: string; hex: string; bin: string; name: string; highlighted: boolean }[] = []

  for (let i = 32; i < 127; i++) {
    const ch = String.fromCharCode(i)
    const hex = i.toString(16).toUpperCase().padStart(2, '0')
    const bin = toBinary(i)
    const name = ASCII_NAMES[i] || ch
    const match =
      !fl ||
      ch.toLowerCase() === fl ||
      String(i) === fl ||
      hex.toLowerCase() === fl ||
      name.toLowerCase().includes(fl)
    if (match) {
      rows.push({ i, ch, hex, bin, name, highlighted: !!fl })
    }
  }

  return (
    <div className="card">
      <h2>► ASCII TABEL VERKENNER</h2>
      <label>ZOEK EEN KARAKTER OF WAARDE</label>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Typ een letter, getal of ASCII-waarde..."
      />
      <div style={{ marginTop: '16px' }} className="ascii-table-wrap">
        <table className="ascii-table">
          <thead>
            <tr>
              <th>CHAR</th>
              <th>DEC</th>
              <th>HEX</th>
              <th>BIN</th>
              <th>NAAM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ i, ch, hex, bin, name, highlighted }) => (
              <tr key={i} className={highlighted ? 'highlight-row' : ''}>
                <td className="char-col">
                  {ch === '<' ? '<' : ch === '>' ? '>' : ch}
                </td>
                <td>{i}</td>
                <td>0x{hex}</td>
                <td>
                  <span style={{ fontSize: '0.68rem' }}>{bin}</span>
                </td>
                <td>{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
