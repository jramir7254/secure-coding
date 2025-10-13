import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import monaco from './lib/monaco-setup.ts'
import App from './main.tsx'
import { ErrorBoundary } from './components/error-boundary.tsx'
import { BrowserRouter, Route, Routes } from "react-router";


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </BrowserRouter>
    </StrictMode>
)

