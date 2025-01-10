# AI闪卡学习助手

这是一个基于Next.js和Deepseek API开发的智能闪卡学习工具。它能帮助用户创建、管理和复习学习卡片，通过AI技术提供智能的学习体验。

## 主要功能

- 🤖 AI辅助生成闪卡：输入主题或自定义内容发给Deepseek API自动生成高质量的学习卡片
- 📚 探索主题：AI探索关联主题，选中后可以发送给AI生成卡片
- 📝 卡片管理：导入和管理已标记的卡片，左右按键切换卡片，空格键显示或隐藏卡片

## 开始使用

1. 克隆项目并安装依赖：

```bash
git clone https://github.com/nicekate/AI-flashcard-deepseek.git
cd AI-flashcard-deepseek
npm install
```

2. 运行开发服务器：

```bash
npm run dev
```

3. 配置API密钥：

访问 [http://localhost:3000](http://localhost:3000)，点击右上角的设置图标，在设置页面中输入您的Deepseek API密钥并保存。

## 技术栈

- [Next.js 14](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [SQLite](https://www.sqlite.org/) - 本地数据存储
- [Deepseek API](https://www.deepseek.com/) - AI服务

## 贡献

欢迎提交Issue和Pull Request！

## 许可

MIT License
