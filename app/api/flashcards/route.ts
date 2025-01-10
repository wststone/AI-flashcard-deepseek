import { NextResponse } from 'next/server';
import { getDeepseekFlashcards } from '@/lib/deepseek';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function POST(request: Request) {
  try {
    const { topic, content, cardCount, difficulty, apiKey, mode } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: '请提供 API 密钥' }, { status: 400 });
    }

    if (mode === 'topic' && !topic) {
      return NextResponse.json({ error: '请提供学习主题' }, { status: 400 });
    }

    if (mode === 'content' && !content) {
      return NextResponse.json({ error: '请提供学习内容' }, { status: 400 });
    }

    const systemPrompt = `你是一个专业的教育助手，擅长创建高质量的学习卡片。
请注意以下要求：
1. 无论输入内容是什么语言，始终用中文创建问答卡片
2. 如果输入内容是英文或其他语言，在回答中可以保留原文，但解释必须用中文
3. 确保问题简短清晰，答案准确完整
4. 严格按照JSON格式返回，不要包含任何其他文字
5. 对于专业术语，可以同时保留原文和中文翻译
6. 问题和答案支持 Markdown 格式，可以使用：
   - 代码块 (\`\`\`)，并标注语言
   - 表格 (|)
   - 列表 (- 或 1.)
   - 粗体 (**) 和斜体 (*)
   - 链接 [文本](URL)
   - 引用 (>)
7. 对于代码示例，请使用代码块并标注编程语言
8. 对于重要概念，使用粗体标注
9. 对于专业术语解释，优先使用表格形式展示
10. 对于步骤说明，使用有序列表`;

    let prompt = '';
    if (mode === 'topic') {
      prompt = `请为我生成${cardCount}张关于"${topic}"主题的闪卡，难度为${difficulty}。
使用 Markdown 格式，并严格按照以下JSON格式返回，确保是有效的JSON：
[
  {
    "question": "Markdown 格式的问题",
    "answer": "Markdown 格式的答案"
  }
]`;
    } else {
      prompt = `请将以下内容分解成${cardCount}张闪卡：

内容：${content}

使用 Markdown 格式，并严格按照以下JSON格式返回，确保是有效的JSON：
[
  {
    "question": "Markdown 格式的问题",
    "answer": "Markdown 格式的答案"
  }
]`;
    }

    const flashcards = await getDeepseekFlashcards(prompt, systemPrompt, apiKey);
    return NextResponse.json({ flashcards });
  } catch (error: any) {
    console.error('生成闪卡失败:', error);
    return NextResponse.json(
      { error: error.message || '生成闪卡失败' },
      { status: 500 }
    );
  }
}
