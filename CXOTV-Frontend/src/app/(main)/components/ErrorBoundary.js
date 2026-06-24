'use client';

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Top-level Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided (e.g. unauthenticated children), render it instead of the crash screen
      if (this.props.fallback !== undefined) {
        console.error('ErrorBoundary: rendering fallback due to auth context failure');
        return this.props.fallback;
      }
      // Default fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 text-center">
          <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
            <p className="mt-4 text-gray-600">
              The application encountered an unexpected error. We&apos;ve been notified and are working on a fix.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
