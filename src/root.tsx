import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import monaco from './lib/monaco-setup.ts'
import App from './main.tsx'
import { ErrorBoundary } from './components/error-boundary.tsx'
import { BrowserRouter } from "react-router";
import { queryClient } from './lib/query-client.ts'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ErrorBoundary>
                <QueryClientProvider client={queryClient}>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </ErrorBoundary>
        </BrowserRouter>
    </StrictMode>
)

