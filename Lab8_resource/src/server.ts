import express, { Request, Response } from "express";
import path from "path";
import { addBook, readBooks, deleteBook, searchBooks } from "./services/bookFileDb";

const app = express();
const PORT = process.env.PORT || 3000;

// TODO 5: Add middleware for HTML form + JSON + static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req: Request, res: Response) => {
  // TODO 6: Send public/index.html
  return res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.get("/books", (req: Request, res: Response) => {
  // TODO 7: Return all books as JSON
  const books = readBooks();
  return res.json(books);
});

app.get("/books/search", (req: Request, res: Response) => {
  const q = String(req.query.q ?? "");
  const results = searchBooks(q);
  return res.json(results);
});

app.post("/books/add", (req: Request, res: Response) => {
  try {
    // TODO 8: Read bookName from req.body.bookName and validate (trim it)
    const bookName = (req.body?.bookName ?? "").trim();
    if (!bookName) {
      return res.status(400).send("bookName is required");
    }

    // TODO 9: Call addBook(bookName)
    addBook(bookName);

    // TODO 10: Redirect to "/" after success
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});
app.post("/books/delete", (req: Request, res: Response) => {
  const bookNo = Number(req.body?.bookNo);

  if (!Number.isFinite(bookNo)) {
    return res.status(400).send("bookNo is required");
  }

  const ok = deleteBook(bookNo);
  if (!ok) return res.status(404).send("Book not found");

  return res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});