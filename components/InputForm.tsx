import React from 'react';
import { FormData, LoadingState, SalesScenario } from '../types';
import { User, Briefcase, Building2, FileText, Sparkles, MessageSquare, Target, Users, Repeat, Handshake } from 'lucide-react';

interface InputFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
  loadingState: LoadingState;
}

const InputForm: React.FC<InputFormProps> = ({ formData, setFormData, onSubmit, loadingState }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScenarioChange = (scenario: SalesScenario) => {
    setFormData(prev => ({ ...prev, scenario }));
  };

  const isFormValid = formData.companyName.trim() !== '' && formData.contactName.trim() !== '';

  const scenarios: { id: SalesScenario; label: string; icon: React.ReactNode }[] = [
    { id: 'COLD_CALL', label: '首次陌生拜访', icon: <Target className="w-4 h-4" /> },
    { id: 'OFFLINE_EVENT', label: '展会/活动', icon: <Users className="w-4 h-4" /> },
    { id: 'REFERRAL', label: '熟人/客户介绍', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'FOLLOW_UP', label: '再次跟进', icon: <Repeat className="w-4 h-4" /> },
    { id: 'PARTNERSHIP', label: '商务合作', icon: <Handshake className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 h-full">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <Sparkles className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-bold">销售场景设定</h2>
      </div>

      <div className="space-y-6">
        
        {/* Scenario Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2.5">
            沟通场景 <span className="text-primary-500 text-xs font-normal ml-1">(AI 将根据场景调整语气)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {scenarios.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScenarioChange(item.id)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border
                  ${formData.scenario === item.id
                    ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:bg-slate-50'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-100 my-4"></div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            待联系公司 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="例如：杭州某某科技有限公司"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-slate-900 placeholder-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Contact Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              联系人姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="例如：王总"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              岗位/头衔
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="例如：市场总监"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            补充信息 (选填)
          </label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            rows={4}
            placeholder="例如：公司近期刚获得A轮融资，或者正在招聘AI工程师。输入具体场景有助于生成更精准的破冰点。"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-slate-900 placeholder-slate-400 resize-none"
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={!isFormValid || loadingState === LoadingState.LOADING}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0
            ${!isFormValid || loadingState === LoadingState.LOADING
              ? 'bg-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-primary-500/30'
            }`}
        >
          {loadingState === LoadingState.LOADING ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI 策略分析与生成中...
            </span>
          ) : (
            '立即生成'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;