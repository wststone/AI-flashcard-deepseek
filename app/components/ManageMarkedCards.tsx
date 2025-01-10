import { useState, useRef, useEffect } from 'react';
import { MarkedCard } from '@/lib/db';
import Papa from 'papaparse';

interface ManageMarkedCardsProps {
  onCardsUpdated?: () => void;
}

export default function ManageMarkedCards({ onCardsUpdated }: ManageMarkedCardsProps) {
  const [markedCards, setMarkedCards] = useState<MarkedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取标记的卡片
  const fetchMarkedCards = async () => {
    try {
      const response = await fetch('/api/marked-cards');
      const data = await response.json();
      setMarkedCards(data.markedCards);
    } catch (error) {
      setError('获取标记卡片失败');
      console.error('获取标记卡片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchMarkedCards();
  }, []);

  // 删除卡片
  const handleDelete = async (id: number) => {
    try {
      await fetch('/api/marked-cards', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      await fetchMarkedCards();
      onCardsUpdated?.();
    } catch (error) {
      setError('删除卡片失败');
      console.error('删除卡片失败:', error);
    }
  };

  // 处理CSV文件导入
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);

    Papa.parse(file, {
      encoding: 'UTF-8',
      complete: async (results) => {
        try {
          console.log('CSV解析结果:', results);
          
          if (!results.data || results.data.length <= 1) {
            throw new Error('CSV文件为空或格式不正确');
          }

          // 获取数据行（跳过标题行）
          const dataRows = results.data.slice(1) as string[][];
          
          // 过滤掉空行
          const validRows = dataRows.filter(row => 
            row.length >= 3 && 
            row[0]?.trim() && 
            row[1]?.trim() && 
            row[2]?.trim()
          );

          if (validRows.length === 0) {
            throw new Error('没有找到有效的数据行');
          }

          const cards = validRows.map(row => ({
            topic: row[0].trim(),
            question: row[1].trim(),
            answer: row[2].trim(),
          }));

          console.log('准备导入的卡片:', cards);

          const response = await fetch('/api/marked-cards/import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cards }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || '导入失败');
          }

          await fetchMarkedCards();
          onCardsUpdated?.();
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setError('导入成功！');
        } catch (error) {
          console.error('导入失败:', error);
          setError(error instanceof Error ? error.message : '导入失败');
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        console.error('解析CSV文件失败:', error);
        setError('解析CSV文件失败: ' + error.message);
        setLoading(false);
      },
      delimiter: ',', // 明确指定分隔符
      skipEmptyLines: true, // 跳过空行
    });
  };

  if (loading) {
    return <div className="text-center py-4">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">已标记内容管理</h2>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileImport}
            ref={fileInputRef}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
          >
            导入CSV
          </label>
          <a
            href="/templates/flashcards_template.csv"
            download
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            下载模板
          </a>
        </div>
      </div>

      {error && (
        <div className={`text-center p-2 rounded ${
          error === '导入成功！' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
        }`}>
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">主题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">问题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">答案</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">创建时间</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {markedCards.map((card) => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{card.topic}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{card.question}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{card.answer}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(card.created_at).toLocaleString('zh-CN')}
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {markedCards.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          暂无标记的卡片
        </div>
      )}
    </div>
  );
}
