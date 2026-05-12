import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Book, BookDraft, ReadingStatus } from "../types/book";
import { READING_STATUS_LABEL, READING_STATUS_OPTIONS } from "../types/book";
import { StarRating } from "./StarRating";

interface BookFormProps {
  initial?: Book;
  onSubmit: (draft: BookDraft) => void;
  onCancel: () => void;
}

function buildInitialDraft(initial?: Book): BookDraft {
  if (initial) {
    return {
      title: initial.title,
      author: initial.author,
      country: initial.country,
      publicationYear: initial.publicationYear,
      category: initial.category,
      coverUrl: initial.coverUrl,
      totalPages: initial.totalPages,
      currentPage: initial.currentPage,
      status: initial.status,
      rating: initial.rating,
      notes: initial.notes,
      startedAt: initial.startedAt,
      finishedAt: initial.finishedAt,
    };
  }
  return {
    title: "",
    author: "",
    country: "",
    publicationYear: undefined,
    category: "",
    coverUrl: "",
    totalPages: undefined,
    currentPage: 0,
    status: "want",
    rating: 0,
    notes: "",
  };
}

export function BookForm({ initial, onSubmit, onCancel }: BookFormProps) {
  const [draft, setDraft] = useState<BookDraft>(() => buildInitialDraft(initial));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(buildInitialDraft(initial));
  }, [initial]);

  const update = <K extends keyof BookDraft>(key: K, value: BookDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = (status: ReadingStatus) => {
    setDraft((prev) => {
      const next: BookDraft = { ...prev, status };
      const now = Date.now();
      if (status === "reading" && !prev.startedAt) next.startedAt = now;
      if (status === "finished") {
        next.finishedAt = now;
        if (prev.totalPages) next.currentPage = prev.totalPages;
      }
      if (status === "want") {
        next.currentPage = 0;
        next.startedAt = undefined;
        next.finishedAt = undefined;
      }
      return next;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (
      draft.totalPages != null &&
      draft.currentPage != null &&
      draft.currentPage > draft.totalPages
    ) {
      setError("Current page cannot exceed total pages.");
      return;
    }
    if (
      draft.publicationYear != null &&
      (draft.publicationYear < 0 || draft.publicationYear > 9999)
    ) {
      setError("Please enter a valid publication year.");
      return;
    }
    setError(null);
    onSubmit({
      ...draft,
      title: draft.title.trim(),
      author: draft.author.trim(),
      country: draft.country.trim() || "Unknown",
      category: draft.category.trim() || "Uncategorized",
      coverUrl: draft.coverUrl?.trim() || undefined,
      notes: draft.notes.trim(),
    });
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2 className="book-form__title">
        {initial ? "Edit book" : "Add a new book"}
      </h2>

      <div className="form-grid">
        <label className="form-field form-field--span-2">
          <span>Title *</span>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => update("title", e.target.value)}
            required
            placeholder="e.g. One Hundred Years of Solitude"
          />
        </label>

        <label className="form-field">
          <span>Author</span>
          <input
            type="text"
            value={draft.author}
            onChange={(e) => update("author", e.target.value)}
            placeholder="e.g. Gabriel García Márquez"
          />
        </label>

        <label className="form-field">
          <span>Author's country</span>
          <input
            type="text"
            value={draft.country}
            onChange={(e) => update("country", e.target.value)}
            placeholder="e.g. Colombia"
          />
        </label>

        <label className="form-field">
          <span>Category</span>
          <input
            type="text"
            value={draft.category}
            onChange={(e) => update("category", e.target.value)}
            placeholder="e.g. Magical Realism"
          />
        </label>

        <label className="form-field">
          <span>Publication year</span>
          <input
            type="number"
            min={0}
            max={9999}
            value={draft.publicationYear ?? ""}
            onChange={(e) =>
              update(
                "publicationYear",
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            placeholder="e.g. 1967"
          />
        </label>

        <label className="form-field form-field--span-2">
          <span>Cover image URL (optional)</span>
          <input
            type="url"
            value={draft.coverUrl ?? ""}
            onChange={(e) => update("coverUrl", e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="form-field">
          <span>Total pages</span>
          <input
            type="number"
            min={0}
            value={draft.totalPages ?? ""}
            onChange={(e) =>
              update(
                "totalPages",
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
            placeholder="0"
          />
        </label>

        <label className="form-field">
          <span>Current page</span>
          <input
            type="number"
            min={0}
            value={draft.currentPage ?? 0}
            onChange={(e) => update("currentPage", Number(e.target.value))}
            placeholder="0"
          />
        </label>

        <fieldset className="form-field form-field--span-2 form-field--inline">
          <legend>Reading status</legend>
          <div className="status-pills">
            {READING_STATUS_OPTIONS.map((s) => (
              <button
                type="button"
                key={s}
                className={`pill ${draft.status === s ? "pill--active" : ""}`}
                onClick={() => handleStatusChange(s)}
              >
                {READING_STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="form-field form-field--span-2">
          <span>Rating</span>
          <StarRating
            value={draft.rating}
            onChange={(v) => update("rating", v)}
            size={26}
          />
        </div>

        <label className="form-field form-field--span-2">
          <span>Notes</span>
          <textarea
            value={draft.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={4}
            placeholder="Write your thoughts, quotes, or excerpts…"
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          {initial ? "Save changes" : "Add to shelf"}
        </button>
      </div>
    </form>
  );
}
