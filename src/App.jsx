import './App.css'
import { Home } from './pages/Home/Home'
import Routes from './pages/Routes.jsx'
import { BrowserRouter } from 'react-router-dom'


function App() {

  return (
    <>
      <BrowserRouter>    
          <Routes />
      </BrowserRouter>
    </>
  )
}

export default App
