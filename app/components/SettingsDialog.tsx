import { useEffect, useState } from 'react';
import SettingsIcon from './SettingsIcon';

interface SettingsDialogProps {
  onApiKeyChange: (apiKey: string) => void;
}

export default function SettingsDialog({ onApiKeyChange }: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // 从localStorage加载API密钥
    const savedApiKey = localStorage.getItem('deepseek_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    localStorage.setItem('deepseek_api_key', apiKey);
    onApiKeyChange(apiKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <SettingsIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-lg font-semibold mb-4">设置</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DeepSeek API 密钥
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="输入您的 API 密钥"
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
            </div>
            {saveSuccess && (
              <div className="text-green-500 text-center">保存成功！</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
