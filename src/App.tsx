import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MainLayout from './components/MainLayout'

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<MainLayout Element={HomePage} />} />
            </Routes>
        </>
    )
}

export default App
