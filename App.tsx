import React, { useState } from 'react';
import { FormData, LoadingState, AnalysisData } from './types';
import InputForm from './components/InputForm';
import ScriptResult from './components/ScriptResult';
import { generateSalesScript } from './services/geminiService';
import { Send } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactName: '',
    position: '',
    additionalInfo: '',
    scenario: 'COLD_CALL'
  });

  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [resultScript, setResultScript] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleGenerate = async () => {
    if (!formData.companyName || !formData.contactName) return;

    setLoadingState(LoadingState.LOADING);
    setResultScript('');
    setAnalysisData(null);
    setErrorMsg('');

    try {
      const result = await generateSalesScript(formData);
      setResultScript(result.script);
      setAnalysisData(result.analysis);
      setLoadingState(LoadingState.SUCCESS);
    } catch (e: any) {
      setErrorMsg(e.message || "未知错误");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
               <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                SalesLink AI
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">资深销售建联助手</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                Gemini 2.5 Flash Powered
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            生成高转化率 <span className="text-primary-600">微信话术</span>
          </h2>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl">
            基于资深销售心理学模型，AI 自动提炼价值锚点。50字以内，精准破冰。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input */}
          <section className="h-full">
            <InputForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleGenerate}
              loadingState={loadingState}
            />
          </section>

          {/* Right Column: Output */}
          <section className="h-full min-h-[400px]">
            <ScriptResult 
              script={resultScript} 
              analysis={analysisData}
              loadingState={loadingState} 
              error={errorMsg}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} SalesLink AI. Designed for B2B Growth.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;