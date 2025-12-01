import React, { useState } from 'react';
import { LoadingState, AnalysisData } from '../types';
import { Copy, Check, MessageCircle, AlertCircle, Zap, Lightbulb, Search, Target } from 'lucide-react';

interface ScriptResultProps {
  script: string;
  analysis: AnalysisData | null;
  loadingState: LoadingState;
  error?: string;
}

const ScriptResult: React.FC<ScriptResultProps> = ({ script, analysis, loadingState, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = script.length;
  const isTooLong = charCount > 50;

  if (loadingState === LoadingState.IDLE) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">等待生成</h3>
        <p className="text-slate-500 max-w-xs text-sm">
          在左侧选择场景并填写信息，AI 将为您拆解破冰逻辑并生成精准话术。
        </p>
      </div>
    );
  }

  if (loadingState === LoadingState.LOADING) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 h-full flex flex-col items-center justify-center">
         <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <SparklesIcon className="w-6 h-6 text-primary-500" />
            </div>
         </div>
         <p className="mt-6 text-slate-600 font-medium animate-pulse">正在拆解业务场景...</p>
         <div className="mt-4 space-y-2 max-w-xs w-full">
            <div className="h-2 bg-slate-100 rounded overflow-hidden">
                <div className="h-full bg-primary-300 w-2/3 animate-[shimmer_1.5s_infinite]"></div>
            </div>
            <div className="h-2 bg-slate-100 rounded overflow-hidden">
                <div className="h-full bg-primary-300 w-1/2 animate-[shimmer_1.5s_infinite_0.2s]"></div>
            </div>
         </div>
      </div>
    );
  }

  if (loadingState === LoadingState.ERROR) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">生成失败</h3>
        <p className="text-slate-500 max-w-xs text-sm mb-4">
          {error || "请稍后重试"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">AI 生成结果</h3>
        </div>
        <div className={`text-xs px-3 py-1 rounded-full font-medium ${isTooLong ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
          {charCount} / 50字
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <div className="p-6 space-y-6">
            
            {/* Script Section */}
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">微信添加话术</label>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 relative group">
                    <p className="text-xl leading-relaxed text-slate-800 font-medium font-sans">
                        {script}
                    </p>
                </div>
                <button
                    onClick={handleCopy}
                    className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all
                        ${copied 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-400 hover:text-primary-600'
                        }`}
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? '已复制' : '复制话术'}
                </button>
            </div>

            {/* Analysis Section (New Process Output) */}
            {analysis && (
                <div className="bg-primary-50/50 rounded-xl border border-primary-100 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-4 h-4 text-primary-600" />
                        <h4 className="font-semibold text-primary-800 text-sm">AI 策略分析思路</h4>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start">
                            <div className="mt-0.5 bg-white p-1 rounded-md shadow-sm text-primary-500">
                                <Search className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-primary-700 mb-0.5">客户背景洞察</h5>
                                <p className="text-sm text-slate-600">{analysis.customerAnalysis}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                             <div className="mt-0.5 bg-white p-1 rounded-md shadow-sm text-amber-500">
                                <Target className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-amber-700 mb-0.5">核心连接点 (破冰)</h5>
                                <p className="text-sm text-slate-600">{analysis.connectionPoint}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                             <div className="mt-0.5 bg-white p-1 rounded-md shadow-sm text-emerald-500">
                                <Zap className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-emerald-700 mb-0.5">价值主张 (钩子)</h5>
                                <p className="text-sm text-slate-600">{analysis.valueProp}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
    </svg>
);

export default ScriptResult;