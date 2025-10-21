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
import { SocketProvider } from './hooks/use-socket.tsx'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <SocketProvider>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                    <ReactQueryDevtools initialIsOpen={false} />
                </SocketProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
)

