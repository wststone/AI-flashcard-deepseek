import { useState, useEffect } from 'react';

interface ExploreTopicsProps {
  apiKey: string;
  onTopicSelect: (topic: string) => void;
  savedKeyword?: string;
  savedTopics?: string[];
  onExplore?: (keyword: string, topics: string[]) => void;
  onClear?: () => void;
}

export default function ExploreTopics({ 
  apiKey, 
  onTopicSelect,
  savedKeyword = '',
  savedTopics = [],
  onExplore,
  onClear
}: ExploreTopicsProps) {
  const [keyword, setKeyword] = useState(savedKeyword);
  const [topics, setTopics] = useState<string[]>(savedTopics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 当保存的关键词和主题发生变化时更新状态
  useEffect(() => {
    setKeyword(savedKeyword);
    setTopics(savedTopics);
  }, [savedKeyword, savedTopics]);

  const handleExplore = async () => {
    if (!keyword.trim()) {
      setError('请输入关键词');
      return;
    }

    if (!apiKey) {
      setError('请先在设置中配置 API 密钥');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/explore-topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '探索主题失败');
      }

      setTopics(data.topics);
      onExplore?.(keyword, data.topics);
    } catch (error) {
      console.error('探索主题失败:', error);
      setError(error instanceof Error ? error.message : '探索主题失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setTopics([]);
    setKeyword('');
    setError('');
    onClear?.();
  };

  const handleTopicClick = (topic: string) => {
    onTopicSelect(topic);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="输入关键词探索相关主题"
          className="flex-1 p-2 border rounded"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              handleExplore();
            }
          }}
        />
        <button
          onClick={handleExplore}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? '探索中...' : '探索'}
        </button>
        {topics.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            清除
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {topics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {topics.map((topic, index) => (
            <button
              key={index}
              onClick={() => handleTopicClick(topic)}
              className="p-3 text-left border rounded hover:bg-gray-50 transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
