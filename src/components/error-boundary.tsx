import React from "react"

type ErrorBoundaryProps = {
    children: React.ReactNode
    fallback?: React.ReactNode
}

type ErrorBoundaryState = {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so next render shows fallback
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by ErrorBoundary:", error, errorInfo)
        // Optionally send to logging service
    }

    render() {
        if (this.state.hasError) {
            // You can show a custom fallback or a default one
            return this.props.fallback || (
                <div className="p-4 text-red-500">
                    <h2>Something went wrong.</h2>
                    <pre>{this.state.error?.message}</pre>
                    <pre>{this.state.error?.stack}</pre>
                </div>
            )
        }

        return this.props.children
    }
}
