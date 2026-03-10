import { useState } from 'react'
import { toUTF8Bytes } from '../utils/encoding'

type ExampleKey = 'html' | 'csv' | 'email' | 'db'

function simulateMoji(text: string, enc: string): { broken: string } {
  if (enc === 'latin1') {
    const bytes = toUTF8Bytes(text)
    return { broken: bytes.map((b) => String.fromCodePoint(b)).join('') }
  } else if (enc === 'utf16') {
    const bytes = toUTF8Bytes(text)
    let broken = ''
    for (let i = 0; i < bytes.length - 1; i += 2) {
      const cp = bytes[i] | (bytes[i + 1] << 8)
      try {
        broken += String.fromCodePoint(cp)
      } catch {
        broken += '?'
      }
    }
    if (!broken || broken.trim() === '') broken = '☐☐☐ (onleesbare bytes)'
    return { broken }
  } else {
    return { broken: [...text].map((ch) => (ch.charCodeAt(0) > 127 ? '?' : ch)).join('') }
  }
}

function getExplain(enc: string) {
  if (enc === 'latin1') {
    return (
      <>
        <span>Wat er gebeurt:</span> De tekst is opgeslagen als <span>UTF-8</span>. Elke letter met
        een accent (bijv. &apos;é&apos;) wordt opgeslagen als <span>2 bytes</span> (bijv. 0xC3
        0xA9). Windows-1252 leest elke byte apart als een karakter, dus{' '}
        <span>2 bytes = 2 verkeerde tekens</span>. Dit zie je veel bij oude websites of e-mails.
      </>
    )
  } else if (enc === 'utf16') {
    return (
      <>
        <span>Wat er gebeurt:</span> UTF-16 gebruikt <span>2 bytes per karakter</span>. Wanneer
        UTF-8 bytes in paren worden gelezen als UTF-16 LE, worden de byte-waarden fout gecombineerd.
        Bovendien ontbreekt de <span>BOM (Byte Order Mark)</span> die normaal aangeeft hoe de bytes
        gelezen moeten worden.
      </>
    )
  } else {
    return (
      <>
        <span>Wat er gebeurt:</span> ASCII gebruikt slechts <span>7 bits (0–127)</span>. Alles
        buiten dat bereik (zoals accenten of emoji&apos;s) heeft geen ASCII-representatie en wordt
        vervangen door een <span>vraagteken</span> of weggelaten. Vroege internetsystemen deden dit
        veel.
      </>
    )
  }
}

function BrowserDots() {
  return (
    <div className="browser-dots">
      <div className="browser-dot" style={{ background: '#ff5f56' }} />
      <div className="browser-dot" style={{ background: '#ffbd2e' }} />
      <div className="browser-dot" style={{ background: '#27c93f' }} />
    </div>
  )
}

function ExampleHTML() {
  return (
    <div className="row-pair">
      <div>
        <div className="scene-label">✗ ZONDER &lt;meta charset&gt;</div>
        <div className="page-title-bar">📄 cafe.html — tab titel: &quot;Caf? Website&quot;</div>
        <div className="browser-chrome">
          <BrowserDots />
          <div className="browser-url">http://www.café-brussel.be/menu</div>
        </div>
        <div className="browser-body broken">
          <h3>Welkom bij CafÃ© De Gouden Leeuw</h3>
          <p>Onze specialiteitÃ©n van het seizoen:</p>
          <p>â€¢ HuisgemÃ¤kte soep â€" â‚¬6,50</p>
          <p>â€¢ GegrillÃ© zalm â€" â‚¬18,00</p>
        </div>
        <div style={{ marginTop: '10px' }}>
          <div className="code-block">
            <span className="tag">&lt;head&gt;</span>
            {'\n'}
            <span className="hl">
              {'  '}
              <span style={{ color: '#555' }}>// geen charset tag!</span>
            </span>
            {'\n  '}
            <span className="tag">&lt;title&gt;</span>Café<span className="tag">&lt;/title&gt;</span>
            {'\n'}
            <span className="tag">&lt;/head&gt;</span>
          </div>
        </div>
      </div>
      <div>
        <div className="scene-label">✓ MET &lt;meta charset=&quot;UTF-8&quot;&gt;</div>
        <div className="page-title-bar">📄 cafe.html — tab titel: &quot;Café Website&quot;</div>
        <div className="browser-chrome">
          <BrowserDots />
          <div className="browser-url">http://www.café-brussel.be/menu</div>
        </div>
        <div className="browser-body">
          <h3>Welkom bij Café De Gouden Leeuw</h3>
          <p>Onze specialités van het seizoen:</p>
          <p>• Huisgemaakte soep — €6,50</p>
          <p>• Gegrillé zalm — €18,00</p>
        </div>
        <div style={{ marginTop: '10px' }}>
          <div className="code-block">
            <span className="tag">&lt;head&gt;</span>
            {'\n'}
            <span className="hl-ok">
              {'  '}
              <span className="tag">&lt;meta</span>{' '}
              <span className="attr">charset</span>=
              <span className="val">&quot;UTF-8&quot;</span>
              <span className="tag">&gt;</span>
            </span>
            {'\n  '}
            <span className="tag">&lt;title&gt;</span>Café<span className="tag">&lt;/title&gt;</span>
            {'\n'}
            <span className="tag">&lt;/head&gt;</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExampleCSV() {
  return (
    <div className="row-pair">
      <div>
        <div className="scene-label">✗ UTF-8 CSV GEOPEND IN EXCEL (Windows)</div>
        <div className="excel-chrome">
          <BrowserDots />
          <span>📊 studenten.csv — Microsoft Excel</span>
          <div className="excel-tab">studenten</div>
        </div>
        <table className="excel-grid">
          <thead>
            <tr>
              <th></th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="row-header">1</td>
              <td>Naam</td>
              <td>Stad</td>
              <td>Score</td>
            </tr>
            <tr>
              <td className="row-header">2</td>
              <td className="broken">RÃ©mi</td>
              <td className="broken">LiÃ¨ge</td>
              <td>87</td>
            </tr>
            <tr>
              <td className="row-header">3</td>
              <td className="broken">FranÃ§ois</td>
              <td className="broken">BrÃ¼gge</td>
              <td>92</td>
            </tr>
            <tr>
              <td className="row-header">4</td>
              <td className="broken">ÃstlÃ¦n</td>
              <td>Gent</td>
              <td>78</td>
            </tr>
          </tbody>
        </table>
        <div className="code-block" style={{ marginTop: '10px', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--green-dim)' }}># Python script dat dit CSV aanmaakt:{'\n'}</span>
          df.to_csv(<span className="val">&apos;studenten.csv&apos;</span>){'\n'}
          <span style={{ color: 'var(--green-dim)' }}>
            # Standaard: UTF-8 zonder BOM → kapot in Excel
          </span>
        </div>
      </div>
      <div>
        <div className="scene-label">✓ MET UTF-8 BOM (utf-8-sig)</div>
        <div className="excel-chrome">
          <BrowserDots />
          <span>📊 studenten.csv — Microsoft Excel</span>
          <div className="excel-tab">studenten</div>
        </div>
        <table className="excel-grid">
          <thead>
            <tr>
              <th></th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="row-header">1</td>
              <td>Naam</td>
              <td>Stad</td>
              <td>Score</td>
            </tr>
            <tr>
              <td className="row-header">2</td>
              <td className="ok">Rémi</td>
              <td className="ok">Liège</td>
              <td>87</td>
            </tr>
            <tr>
              <td className="row-header">3</td>
              <td className="ok">François</td>
              <td className="ok">Brügge</td>
              <td>92</td>
            </tr>
            <tr>
              <td className="row-header">4</td>
              <td className="ok">Østlæn</td>
              <td>Gent</td>
              <td>78</td>
            </tr>
          </tbody>
        </table>
        <div className="code-block" style={{ marginTop: '10px', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--green-dim)' }}># Oplossing: BOM toevoegen{'\n'}</span>
          df.to_csv(<span className="val">&apos;studenten.csv&apos;</span>, encoding=
          <span className="val">&apos;utf-8-sig&apos;</span>){'\n'}
          <span style={{ color: 'var(--green-dim)' }}>
            # BOM = 0xEF 0xBB 0xBF → Excel herkent UTF-8
          </span>
        </div>
      </div>
    </div>
  )
}

function ExampleEmail() {
  return (
    <div className="row-pair">
      <div>
        <div className="scene-label">✗ E-MAIL MET VERKEERDE ENCODING</div>
        <div className="email-chrome">
          <div className="email-header-row">
            <span>Van:</span>
            <span>info@museum-brugge.be</span>
          </div>
          <div className="email-header-row">
            <span>Aan:</span>
            <span>klant@example.com</span>
          </div>
          <div className="email-header-row">
            <span>Onderwerp:</span>
            <span>Bevestiging uw bezoek aan het Gr=C3=B6ningemuseum</span>
          </div>
        </div>
        <div className="email-body-wrap broken">
          {`Geachte mevrouw M=C3=BCller,

Bedankt voor uw reservering voor het
Gr=C3=B6ningemuseum op vrijdag 13 juni.

Uw ticket(s): 2 x â‚¬14,00 = â‚¬28,00

Wij kijken ernaar uit u te verwelkomen!

Met vriendelijke groeten,
H=C3=A9l=C3=A8ne Vandenh=C3=A2ve`}
        </div>
        <div className="email-raw">
          Content-Type: text/plain
          <span style={{ color: 'var(--red)' }}>
            {' '}
            <span style={{ background: 'rgba(255,68,68,0.1)' }}>↑ geen charset!</span>
          </span>
          {'\n'}Content-Transfer-Encoding: quoted-printable
        </div>
      </div>
      <div>
        <div className="scene-label">✓ MET CORRECTE CHARSET HEADER</div>
        <div className="email-chrome">
          <div className="email-header-row">
            <span>Van:</span>
            <span>info@museum-brugge.be</span>
          </div>
          <div className="email-header-row">
            <span>Aan:</span>
            <span>klant@example.com</span>
          </div>
          <div className="email-header-row">
            <span>Onderwerp:</span>
            <span>Bevestiging uw bezoek aan het Grüningemuseum</span>
          </div>
        </div>
        <div className="email-body-wrap">
          {`Geachte mevrouw Müller,

Bedankt voor uw reservering voor het
Grüningemuseum op vrijdag 13 juni.

Uw ticket(s): 2 x €14,00 = €28,00

Wij kijken ernaar uit u te verwelkomen!

Met vriendelijke groeten,
Hélène Vandenhâve`}
        </div>
        <div className="email-raw">
          Content-Type: text/plain
          <span style={{ color: 'var(--green)' }}>; charset=UTF-8</span>
          {'\n'}Content-Transfer-Encoding: quoted-printable
        </div>
      </div>
    </div>
  )
}

function ExampleDB() {
  return (
    <div className="row-pair">
      <div>
        <div className="scene-label">✗ MySQL MET utf8 (BEPERKT)</div>
        <div className="terminal-chrome">
          <BrowserDots />
          <span style={{ color: '#aaaaff' }}>mysql — gebruiker@localhost</span>
        </div>
        <div className="terminal-body">
          <span className="t-comment">-- Tabel aangemaakt met &apos;utf8&apos; charset{'\n'}</span>
          <span className="t-prompt">mysql&gt; </span>
          <span className="t-cmd">CREATE TABLE posts ({'\n'}</span>
          <span className="t-cmd">{'  '}inhoud VARCHAR(255){'\n'}</span>
          <span className="t-cmd">
            ) CHARSET=<span style={{ color: '#ff8888' }}>utf8</span>;
          </span>
          {'\n\n'}
          <span className="t-prompt">mysql&gt; </span>
          <span className="t-cmd">INSERT INTO posts VALUES{'\n'}</span>
          <span className="t-cmd">{'  '}(&apos;Top resultaat! 🚀&apos;);{'\n\n'}</span>
          <span className="t-err">ERROR 1366 (HY000): Incorrect string{'\n'}</span>
          <span className="t-err">value: &apos;\xF0\x9F\x9A\x80&apos; for column{'\n'}</span>
          <span className="t-err">&apos;inhoud&apos; at row 1{'\n\n'}</span>
          <span className="t-comment">-- utf8 in MySQL = max 3 bytes (U+0000–U+FFFF){'\n'}</span>
          <span className="t-comment">-- Emoji 🚀 = U+1F680 = 4 bytes → GEBLOKKEERD</span>
        </div>
      </div>
      <div>
        <div className="scene-label">✓ MySQL MET utf8mb4 (VOLLEDIG UNICODE)</div>
        <div className="terminal-chrome">
          <BrowserDots />
          <span style={{ color: '#aaaaff' }}>mysql — gebruiker@localhost</span>
        </div>
        <div className="terminal-body">
          <span className="t-comment">-- utf8mb4 = echte UTF-8 (max 4 bytes){'\n'}</span>
          <span className="t-prompt">mysql&gt; </span>
          <span className="t-cmd">ALTER TABLE posts{'\n'}</span>
          <span className="t-cmd">
            {'  '}CONVERT TO CHARACTER SET{' '}
            <span style={{ color: 'var(--green)' }}>utf8mb4</span>
            {'\n'}
          </span>
          <span className="t-cmd">
            {'  '}COLLATE <span style={{ color: 'var(--green)' }}>utf8mb4_unicode_ci</span>;
          </span>
          {'\n\n'}
          <span className="t-ok">Query OK, 0 rows affected{'\n\n'}</span>
          <span className="t-prompt">mysql&gt; </span>
          <span className="t-cmd">INSERT INTO posts VALUES{'\n'}</span>
          <span className="t-cmd">{'  '}(&apos;Top resultaat! 🚀&apos;);{'\n\n'}</span>
          <span className="t-ok">Query OK, 1 row affected{'\n\n'}</span>
          <span className="t-prompt">mysql&gt; </span>
          <span className="t-cmd">SELECT inhoud FROM posts;{'\n'}</span>
          <span className="t-ok">Top resultaat! 🚀</span>
        </div>
      </div>
    </div>
  )
}

const EXAMPLE_EXPLAINS: Record<ExampleKey, React.ReactNode> = {
  html: (
    <>
      Zonder <span>&lt;meta charset&gt;</span> raadt de browser de encoding. Een UTF-8 bestand dat
      als <span>Windows-1252</span> wordt gelezen, splitst multi-byte tekens op:{' '}
      <span>&apos;é&apos; (0xC3 0xA9)</span> wordt twee losse tekens:{' '}
      <span>&apos;Ã&apos; en &apos;©&apos;</span>.
    </>
  ),
  csv: (
    <>
      Excel (Windows) opent CSV-bestanden standaard als <span>Windows-1252</span>. Een{' '}
      <span>BOM (Byte Order Mark, 0xEF BB BF)</span> aan het begin van het bestand signaleert dat
      het UTF-8 is. Python&apos;s <span>encoding=&apos;utf-8-sig&apos;</span> voegt dit automatisch
      toe.
    </>
  ),
  email: (
    <>
      E-mailprotocollen zijn oud en gebruikten vroeger <span>US-ASCII of ISO-8859-1</span>. Zonder{' '}
      <span>charset=UTF-8</span> in de Content-Type header interpreteert de ontvanger de bytes in
      zijn eigen standaardencoding, wat resulteert in{' '}
      <span>Quoted-Printable artefacten</span> zoals <span>=C3=B6</span> in plaats van{' '}
      <span>ö</span>.
    </>
  ),
  db: (
    <>
      MySQL&apos;s <span>utf8</span> charset is een historische fout: het ondersteunt slechts{' '}
      <span>3 bytes per karakter (U+0000–U+FFFF)</span>. Emoji&apos;s en zeldzame Unicode-tekens
      vereisen <span>4 bytes</span>. Gebruik altijd <span>utf8mb4</span> voor echte UTF-8
      ondersteuning. Dit geldt ook voor MariaDB.
    </>
  ),
}

const EXAMPLE_COMPONENTS: Record<ExampleKey, React.ReactNode> = {
  html: <ExampleHTML />,
  csv: <ExampleCSV />,
  email: <ExampleEmail />,
  db: <ExampleDB />,
}

export default function MojibakePage() {
  const [mojiInput, setMojiInput] = useState('Ça va très bien!')
  const [mojiEncoding, setMojiEncoding] = useState('latin1')
  const [activeExample, setActiveExample] = useState<ExampleKey>('html')

  const { broken } = simulateMoji(mojiInput, mojiEncoding)
  const explain = getExplain(mojiEncoding)

  return (
    <>
      <div className="card">
        <h2>► MOJIBAKE SIMULATOR</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--green-dim)', marginBottom: '14px', lineHeight: '1.7' }}>
          Mojibake ontstaat wanneer tekst geëncodeerd is in één encoding maar gelezen wordt met een
          andere. Bekijk wat er misgaat en waarom.
        </p>

        <label>ORIGINELE TEKST (UTF-8)</label>
        <input
          type="text"
          value={mojiInput}
          onChange={(e) => setMojiInput(e.target.value)}
        />

        <label style={{ marginTop: '14px' }}>VERKEERD GELEZEN ALS</label>
        <select value={mojiEncoding} onChange={(e) => setMojiEncoding(e.target.value)}>
          <option value="latin1">Windows-1252 / Latin-1</option>
          <option value="utf16">UTF-16 LE (zonder BOM)</option>
          <option value="ascii">ASCII (7-bit)</option>
        </select>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div>
            <label>✓ CORRECT (UTF-8)</label>
            <div className="output-block fixed-text">{mojiInput}</div>
          </div>
          <div>
            <label>✗ KAPOT GELEZEN</label>
            <div className="output-block broken-text">{broken}</div>
          </div>
        </div>

        <div className="explain-block">{explain}</div>
      </div>

      <div className="card">
        <h2>► ECHTE VOORBEELDEN</h2>
        <div className="ex-tabs">
          {(['html', 'csv', 'email', 'db'] as ExampleKey[]).map((key) => (
            <button
              key={key}
              className={'ex-tab' + (activeExample === key ? ' active' : '')}
              onClick={() => setActiveExample(key)}
            >
              {key === 'html' && '🌐 HTML / Browser'}
              {key === 'csv' && '📊 CSV in Excel'}
              {key === 'email' && '✉ Oude e-mail'}
              {key === 'db' && '🗄 MySQL / DB'}
            </button>
          ))}
        </div>

        {EXAMPLE_COMPONENTS[activeExample]}

        <div className="explain-block" style={{ marginTop: '14px' }}>
          {EXAMPLE_EXPLAINS[activeExample]}
        </div>
      </div>
    </>
  )
}
