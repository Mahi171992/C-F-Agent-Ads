import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Phone } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in C&F Agent Portal:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white font-sans">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-white">
              C&amp;F AGENT
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              অ্যাপ্লিকেশনটি লোড হতে সমস্যা হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা আমাদের হটলাইনে যোগাযোগ করুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                <span>রিফ্রেশ করুন</span>
              </button>
              <a
                href="https://wa.me/8801713872156"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                <span>হটলাইন সাপোর্ট</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
