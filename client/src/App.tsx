import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from "./pages/landing-page";
import PlayGroundPage from './pages/playground-page';
import LoadingSpinner from './components/loading-spinner';
import LoginPage from './pages/login-page';
import CanvasHistoryPage from './pages/canvas-history-page';


function App() {

  return (

    <Router>
      <Routes>
        <Route
          path="/callback"
          element={<LoadingSpinner />}
        />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/canvas/history" element={<CanvasHistoryPage />} />
        <Route path="/canvas/:id" element={<PlayGroundPage />} />
      </Routes>
    </Router>


  )
}

export default App
