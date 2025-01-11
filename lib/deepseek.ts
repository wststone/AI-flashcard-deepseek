const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function getDeepseekCompletion(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的教育助手，擅长创建高质量的学习内容。请用简洁清晰的中文回答。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || '调用AI接口失败');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

export async function getDeepseekFlashcards(prompt: string, systemPrompt: string, apiKey: string): Promise<{question: string, answer: string}[]> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || '调用AI接口失败');
  }

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  
  try {
    return JSON.parse(content);
  } catch {
    console.error('解析JSON失败:', content);
    throw new Error('AI返回的数据格式不正确');
  }
}
