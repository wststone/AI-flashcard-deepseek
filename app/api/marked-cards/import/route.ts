import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { cards } = await request.json();

    if (!Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json({ error: '无效的卡片数据' }, { status: 400 });
    }

    // 批量导入卡片
    for (const card of cards) {
      if (!card.topic || !card.question || !card.answer) {
        continue; // 跳过无效数据
      }
      await dbService.markCard(card.topic, card.question, card.answer);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('导入卡片失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '导入失败' },
      { status: 500 }
    );
  }
}
