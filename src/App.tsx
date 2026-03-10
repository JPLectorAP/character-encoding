import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import EncodePage from './pages/EncodePage'
import AsciiPage from './pages/AsciiPage'
import MojibakePage from './pages/MojibakePage'
import QuizPage from './pages/QuizPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/encode" replace />} />
          <Route path="encode" element={<EncodePage />} />
          <Route path="ascii" element={<AsciiPage />} />
          <Route path="mojibake" element={<MojibakePage />} />
          <Route path="quiz" element={<QuizPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
