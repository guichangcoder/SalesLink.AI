import { GoogleGenAI, Type } from "@google/genai";
import { FormData, GeneratedResult, SalesScenario } from "../types";

const SYSTEM_INSTRUCTION = `
你是某公司的资深销售专家，拥有10年以上的B2B销售经验，专注于为企业提供数字化转型解决方案。
你深谙销售心理学，能够快速洞察客户的痛点和需求。

任务：根据用户提供的目标客户信息和【沟通场景】，编写一段"添加微信好友"的申请话术，并输出你的分析思路。

# Workflow (思维过程)
1. **分析客户信息**：结合行业利好或一般性痛点。
2. **识别连接点**：找出最强的“连接点”和“价值切入点”。
3. **场景适配**：根据用户选择的场景（如陌生拜访、展会、转介绍等）调整语气和切入角度。
4. **话术生成**：严格遵循四段式结构：【精准称呼】+【关键连接点/破冰】+【清晰价值主张】+【消除压力/行动呼吁】。

# 核心规则
1. **话术字数严格限制在50字以内** (包含标点)。这非常重要。
2. 如果字数超出，必须删减自我介绍，精简用词，甚至省略最后的句号。
3. 语气专业、真诚、不卑不亢。
`;

const getScenarioLabel = (scenario: SalesScenario): string => {
  const map: Record<SalesScenario, string> = {
    'COLD_CALL': '首次陌生拜访 (Cold Reach)',
    'OFFLINE_EVENT': '展会/线下活动相遇 (Offline Event)',
    'REFERRAL': '老客户/朋友转介绍 (Referral)',
    'FOLLOW_UP': '前期沟通后的跟进 (Follow-up)',
    'PARTNERSHIP': '寻求商务合作 (Partnership)'
  };
  return map[scenario];
};

export const generateSalesScript = async (data: FormData): Promise<GeneratedResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
    请生成一条微信添加好友话术及分析报告。
    
    【输入信息】
    沟通场景：${getScenarioLabel(data.scenario)}
    待联系公司：${data.companyName}
    待联系人：${data.contactName}
    岗位：${data.position}
    其他补充信息：${data.additionalInfo || "无"}
    
    【要求】
    1. 生成结果必须为 JSON 格式。
    2. script 字段必须 < 50字。
    3. analysis 字段包含对客户背景、连接点、价值主张的简要分析。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            script: {
              type: Type.STRING,
              description: "最终生成的微信添加话术，严格控制在50字以内。",
            },
            analysis: {
              type: Type.OBJECT,
              properties: {
                customerAnalysis: {
                  type: Type.STRING,
                  description: "基于输入信息的简要客户背景或痛点分析 (20字左右)。",
                },
                connectionPoint: {
                  type: Type.STRING,
                  description: "你选择的破冰连接点是什么 (例如：同行背书、行业动态)。",
                },
                valueProp: {
                  type: Type.STRING,
                  description: "你设计的价值钩子是什么。",
                },
              },
              required: ["customerAnalysis", "connectionPoint", "valueProp"],
            },
          },
          required: ["script", "analysis"],
        },
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("生成结果为空");
    }

    const result = JSON.parse(text) as GeneratedResult;
    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("无法连接到 AI 服务，请检查网络或 API Key。");
  }
};