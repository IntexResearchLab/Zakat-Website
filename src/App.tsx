import About from './pages/About'
import Home from './pages/Home'
import Header from './components/reusables/Header'
import { Navigate, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <main className="min-h-screen bg-[#eef7fb] text-[#16324f]">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </main>
  )
}

export default App
