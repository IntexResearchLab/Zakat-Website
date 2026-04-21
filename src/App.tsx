import About from './pages/About'
import Home from './pages/Home'
import Header from './components/reusables/Header'

function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const isAboutPage = pathname === '/about'

  return (
    <main className="min-h-screen bg-[#eef7fb] text-[#16324f]">
      <Header activePage={isAboutPage ? 'about' : 'home'} />
      {isAboutPage ? <About /> : <Home />}
    </main>
  )
}

export default App
