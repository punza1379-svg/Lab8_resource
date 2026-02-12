import fs from "fs";
import path from "path";

export type Book = {
  bookNo: number;
  bookName: string;
};

type DbShape = { books: Book[] };

const dbPath = path.join(process.cwd(), "data", "books.json");

function readDb(): DbShape {
  const dirPath = path.dirname(dbPath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    const initDb: DbShape = { books: [] };
    fs.writeFileSync(dbPath, JSON.stringify(initDb, null, 2), "utf-8");
    return initDb;
  }

  const text = fs.readFileSync(dbPath, "utf-8").trim();
  if (!text) return { books: [] };

  const parsed = JSON.parse(text) as DbShape;
  if (!parsed || !Array.isArray(parsed.books)) return { books: [] };

  return parsed;
}

// JSON.stringify(db, null, 2) and writeFileSync utf-8
function writeDb(db: DbShape) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
}

export function readBooks(): Book[] {
  return readDb().books;
}

export function addBook(bookName: string): Book {
  const name = (bookName ?? "").trim();
  if (!name) throw new Error("bookName is required");

  const db = readDb();
  const maxNo = db.books.reduce((max, b) => Math.max(max, b.bookNo), 0);

  const newBook: Book = { bookNo: maxNo + 1, bookName: name };
  db.books.push(newBook);
  writeDb(db);

  return newBook;
}
export function deleteBook(bookNo: number): boolean {
  const db = readDb();
  const before = db.books.length;

  db.books = db.books.filter((b) => b.bookNo !== bookNo);

  if (db.books.length === before) return false; 

  writeDb(db);
  return true;
}
export function searchBooks(keyword: string): Book[] {
  const q = (keyword ?? "").trim().toLowerCase();
  const books = readDb().books;

  if (!q) return books; 

  return books.filter((b) => b.bookName.toLowerCase().includes(q));
}