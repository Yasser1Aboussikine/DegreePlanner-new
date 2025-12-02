import { useState } from 'react'
import HeroSection from './features/LandingPage/components/HeroSection'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes> 
    <Route path="/" element={<HeroSection />}
    />
    <Route path="/sign-in" element={<div>Sign In Page</div>} />
    </Routes> 
    </BrowserRouter>
  )
}

export default App
