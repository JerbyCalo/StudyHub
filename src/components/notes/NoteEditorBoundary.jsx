"use client";

import { Component } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

/**
 * NoteEditorBoundary — React error boundary wrapping the Tiptap NoteEditor.
 * Catches any runtime errors (e.g. Tiptap SSR failures) and shows a friendly
 * fallback instead of a blank crash screen.
 *
 * Usage:
 *   <NoteEditorBoundary>
 *     <NoteEditor ... />
 *   </NoteEditorBoundary>
 */
export default class NoteEditorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("[NoteEditorBoundary] Editor crashed:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <AlertTriangle className="h-10 w-10 text-red-400" />
          <div>
            <p className="text-base font-semibold text-red-700">
              Editor failed to load
            </p>
            <p className="mt-1 text-sm text-red-500">
              Please refresh the page to try again.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
