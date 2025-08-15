import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

import React from 'react'
import Login from './pages/Auth/Login';
import SingUp from './pages/Auth/SingUp';
import Home from './pages/Home/Home';

const App = () => {
  return (
    <div>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SingUp />} />
            </Routes>
        </Router>
    </div>
  )
}

export default App