import { NextRequest, NextResponse } from 'next/server';
import { getDeepseekCompletion } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const { keyword, apiKey } = await request.json();

    if (!keyword || !apiKey) {
      return NextResponse.json(
        { error: '缺少关键词或API密钥' },
        { status: 400 }
      );
    }

    const prompt = `作为一个知识专家，请基于关键词"${keyword}"，生成8-12个相关的学习主题。
这些主题应该：
1. 与原关键词密切相关
2. 涵盖不同的知识维度
3. 具有学习价值
4. 主题的难度要有区分，从基础到进阶
5. 每个主题用简短的短语表达（不超过15个字）

请直接返回主题列表，每行一个主题，不要有编号或其他额外文字。`;

    const response = await getDeepseekCompletion(prompt, apiKey);
    const topics = response.split('\n').filter(topic => topic.trim());

    return NextResponse.json({ topics });
  } catch (error: any) {
    console.error('探索主题失败:', error);
    return NextResponse.json(
      { error: error.message || '探索主题失败' },
      { status: 500 }
    );
  }
}
