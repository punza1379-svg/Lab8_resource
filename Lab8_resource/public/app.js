async function loadBooks(url = "/books") {
  const res = await fetch(url);
  const books = await res.json();

  const el = document.getElementById("book-list");
  el.innerHTML = books
    .map(
      (b) => `
      <div style="display:flex; gap:8px; align-items:center; margin:4px 0;">
        <div style="flex:1;">${b.bookNo}. ${b.bookName}</div>

        <form action="/books/delete" method="POST" style="margin:0;">
          <input type="hidden" name="bookNo" value="${b.bookNo}" />
          <button type="submit">Delete</button>
        </form>
      </div>
    `
    )
    .join("");
}

window.addEventListener("DOMContentLoaded", () => {
  loadBooks();

  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("search-btn");
  const clearBtn = document.getElementById("clear-btn");

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const q = encodeURIComponent(searchInput.value || "");
      loadBooks(`/books/search?q=${q}`);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      loadBooks("/books");
    });
  }
});