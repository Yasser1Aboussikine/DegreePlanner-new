import { useState } from 'react'
import Home from './features/LandingPage/pages/Home'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes> 
    <Route path="/" element={<Home />}
    />
    <Route path="/sign-in" element={<div>Sign In Page</div>} />
    </Routes> 
    </BrowserRouter>
  )
}

export default App
