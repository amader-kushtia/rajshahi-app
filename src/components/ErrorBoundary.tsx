import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[350px] w-full flex items-center justify-center p-6 bg-slate-50 border border-pink-200/80 rounded-3xl my-4">
          <div className="max-w-md text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 border border-rose-200 rounded-3xl flex items-center justify-center mx-auto text-rose-600 shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                কিছু একটি অপ্রত্যাশিত সমস্যা হয়েছে
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                পেজটি লোড করতে গিয়ে একটি ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা হোমপেজে ফিরে যান।
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-white border border-pink-200/80 rounded-2xl text-[11px] font-mono text-slate-500 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>পুনরায় চেষ্টা করুন</span>
              </button>

              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>হোমপেজ</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
