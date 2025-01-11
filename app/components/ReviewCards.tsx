import { useState, useEffect } from 'react';
import { MarkedCard } from '@/lib/db';
import FlashCard from './FlashCard';

interface ReviewCardsProps {
  onCardRemoved?: () => void;
}

export default function ReviewCards({ onCardRemoved }: ReviewCardsProps) {
  const [markedCards, setMarkedCards] = useState<MarkedCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMarkedCards = async () => {
    try {
      const response = await fetch('/api/marked-cards');
      const data = await response.json();
      setMarkedCards(data.markedCards);
      setCurrentCardIndex(0);
    } catch (error) {
      console.error('获取标记卡片失败:', error);
      setError('获取标记卡片失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkedCards();

    // 添加键盘事件监听
    const handleKeyPress = (event: KeyboardEvent) => {
      if (markedCards.length === 0) return;
      
      if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === ' ') {
        // 添加空格键事件监听
        // const currentCard = markedCards[currentCardIndex];
        // TODO: 调用 FlashCard 组件的 toggleAnswer 方法
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // 清理事件监听
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [markedCards.length]); // 依赖项包含 markedCards.length

  const handlePrevious = () => {
    setCurrentCardIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : prev;
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) => {
      const newIndex = prev < markedCards.length - 1 ? prev + 1 : prev;
      return newIndex;
    });
  };

  const handleLearnedCard = async () => {
    if (markedCards.length === 0) return;
    
    const currentCard = markedCards[currentCardIndex];
    try {
      await fetch('/api/marked-cards', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentCard.id }),
      });

      // 更新本地状态
      const newMarkedCards = markedCards.filter(card => card.id !== currentCard.id);
      setMarkedCards(newMarkedCards);
      
      // 如果删除的是最后一张卡片，调整索引
      if (currentCardIndex >= newMarkedCards.length) {
        setCurrentCardIndex(Math.max(0, newMarkedCards.length - 1));
      }
      
      onCardRemoved?.();
    } catch (error) {
      console.error('移除标记卡片失败:', error);
      setError('移除卡片失败');
    }
  };

  if (loading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  if (markedCards.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        暂无标记的卡片
      </div>
    );
  }

  const currentCard = markedCards[currentCardIndex];

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-16">
          <button 
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
            className="p-4 bg-blue-500 text-white rounded-full disabled:bg-gray-400 hover:bg-blue-600 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-16">
          <button 
            onClick={handleNext}
            disabled={currentCardIndex === markedCards.length - 1}
            className="p-4 bg-blue-500 text-white rounded-full disabled:bg-gray-400 hover:bg-blue-600 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div className="mb-4 text-sm text-gray-500">
          主题: {currentCard.topic}
        </div>

        <FlashCard
          question={currentCard.question}
          answer={currentCard.answer}
          cardIndex={currentCardIndex}
        />
      </div>

      <div className="mt-4 text-center text-gray-500">
        进度: {currentCardIndex + 1}/{markedCards.length}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleLearnedCard}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          已学会
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mt-2">
          {error}
        </div>
      )}
    </div>
  );
}
