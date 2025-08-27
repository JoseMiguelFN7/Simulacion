import Index from "./page/index.jsx"
import Calculadora from "./page/calculadora.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/calculadora/:operacion" element={<Calculadora />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
