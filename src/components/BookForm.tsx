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
      setError("书名不能为空");
      return;
    }
    if (
      draft.totalPages != null &&
      draft.currentPage != null &&
      draft.currentPage > draft.totalPages
    ) {
      setError("当前页数不能超过总页数");
      return;
    }
    if (
      draft.publicationYear != null &&
      (draft.publicationYear < 0 || draft.publicationYear > 9999)
    ) {
      setError("请输入有效的出版年份");
      return;
    }
    setError(null);
    onSubmit({
      ...draft,
      title: draft.title.trim(),
      author: draft.author.trim(),
      country: draft.country.trim() || "未知",
      category: draft.category.trim() || "未分类",
      coverUrl: draft.coverUrl?.trim() || undefined,
      notes: draft.notes.trim(),
    });
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2 className="book-form__title">
        {initial ? "编辑图书" : "添加新书"}
      </h2>

      <div className="form-grid">
        <label className="form-field form-field--span-2">
          <span>书名 *</span>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => update("title", e.target.value)}
            required
            placeholder="例如：百年孤独"
          />
        </label>

        <label className="form-field">
          <span>作者</span>
          <input
            type="text"
            value={draft.author}
            onChange={(e) => update("author", e.target.value)}
            placeholder="例如：马尔克斯"
          />
        </label>

        <label className="form-field">
          <span>作者国家</span>
          <input
            type="text"
            value={draft.country}
            onChange={(e) => update("country", e.target.value)}
            placeholder="例如：哥伦比亚"
          />
        </label>

        <label className="form-field">
          <span>类别</span>
          <input
            type="text"
            value={draft.category}
            onChange={(e) => update("category", e.target.value)}
            placeholder="例如：魔幻现实主义"
          />
        </label>

        <label className="form-field">
          <span>出版年份</span>
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
            placeholder="例如：1967"
          />
        </label>

        <label className="form-field form-field--span-2">
          <span>封面图片链接（可选）</span>
          <input
            type="url"
            value={draft.coverUrl ?? ""}
            onChange={(e) => update("coverUrl", e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="form-field">
          <span>总页数</span>
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
          <span>当前阅读进度（页）</span>
          <input
            type="number"
            min={0}
            value={draft.currentPage ?? 0}
            onChange={(e) => update("currentPage", Number(e.target.value))}
            placeholder="0"
          />
        </label>

        <fieldset className="form-field form-field--span-2 form-field--inline">
          <legend>阅读状态</legend>
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
          <span>评分</span>
          <StarRating
            value={draft.rating}
            onChange={(v) => update("rating", v)}
            size={26}
          />
        </div>

        <label className="form-field form-field--span-2">
          <span>读书笔记</span>
          <textarea
            value={draft.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={4}
            placeholder="记录你的想法、引文或摘抄……"
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="btn btn--primary">
          {initial ? "保存修改" : "添加到书架"}
        </button>
      </div>
    </form>
  );
}
