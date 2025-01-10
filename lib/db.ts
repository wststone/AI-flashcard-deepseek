import sqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 确保数据库目录存在
const DB_DIR = path.join(process.cwd(), '.local');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = sqlite3(path.join(DB_DIR, 'flashcards.db'));

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS marked_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export interface MarkedCard {
  id: number;
  topic: string;
  question: string;
  answer: string;
  created_at: string;
}

export const dbService = {
  markCard: (topic: string, question: string, answer: string) => {
    const stmt = db.prepare('INSERT INTO marked_cards (topic, question, answer) VALUES (?, ?, ?)');
    return stmt.run(topic, question, answer);
  },

  unmarkCard: (id: number) => {
    const stmt = db.prepare('DELETE FROM marked_cards WHERE id = ?');
    return stmt.run(id);
  },

  getMarkedCards: (): MarkedCard[] => {
    const stmt = db.prepare('SELECT * FROM marked_cards ORDER BY created_at DESC');
    return stmt.all() as MarkedCard[];
  },
};
