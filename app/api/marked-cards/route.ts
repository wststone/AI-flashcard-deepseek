import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET() {
  try {
    const markedCards = dbService.getMarkedCards();
    return NextResponse.json({ markedCards });
  } catch (error) {
    console.error('获取标记卡片失败:', error);
    return NextResponse.json({ error: '获取标记卡片失败' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { topic, question, answer } = await req.json();
    dbService.markCard(topic, question, answer);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('标记卡片失败:', error);
    return NextResponse.json({ error: '标记卡片失败' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    dbService.unmarkCard(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('取消标记失败:', error);
    return NextResponse.json({ error: '取消标记失败' }, { status: 500 });
  }
}
