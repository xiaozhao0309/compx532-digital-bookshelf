import type { Book } from "../types/book";

const STORAGE_KEY = "digital-bookshelf:books:v2";
const LEGACY_KEY = "digital-bookshelf:books:v1";

export function loadBooks(): Book[] {
  try {
    localStorage.removeItem(LEGACY_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedBooks();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedBooks();
    return parsed.map(migrateBook);
  } catch {
    return [];
  }
}

export function saveBooks(books: Book[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function migrateBook(raw: Partial<Book>): Book {
  return {
    country: "未知",
    publicationYear: undefined,
    coverUrl: undefined,
    totalPages: undefined,
    currentPage: 0,
    rating: 0,
    notes: "",
    status: "want",
    category: "未分类",
    author: "",
    title: "",
    id: generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...raw,
  } as Book;
}

function seedBooks(): Book[] {
  const now = Date.now();
  const day = 86_400_000;
  const make = (
    n: number,
    overrides: Partial<Book> & { title: string; author: string },
  ): Book => ({
    id: generateId(),
    title: overrides.title,
    author: overrides.author,
    country: overrides.country ?? "未知",
    publicationYear: overrides.publicationYear,
    category: overrides.category ?? "未分类",
    totalPages: overrides.totalPages,
    currentPage: overrides.currentPage ?? 0,
    status: overrides.status ?? "want",
    rating: overrides.rating ?? 0,
    notes: overrides.notes ?? "",
    coverUrl: overrides.coverUrl,
    createdAt: now - n * day,
    updatedAt: now - n * day,
    startedAt: overrides.startedAt,
    finishedAt: overrides.finishedAt,
  });

  const sample: Book[] = [
    make(1, {
      title: "红楼梦",
      author: "曹雪芹",
      country: "中国",
      publicationYear: 1791,
      category: "古典文学",
      totalPages: 1300,
      currentPage: 1300,
      status: "finished",
      rating: 5,
      notes: "中国古典小说的巅峰之作，人物刻画与社会观察都极为细腻。",
      finishedAt: now - 90 * day,
    }),
    make(2, {
      title: "三体",
      author: "刘慈欣",
      country: "中国",
      publicationYear: 2008,
      category: "科幻",
      totalPages: 302,
      currentPage: 180,
      status: "reading",
      rating: 5,
      notes: "宏大的宇宙观和黑暗森林假说让人震撼。",
      startedAt: now - 20 * day,
    }),
    make(3, {
      title: "战争与和平",
      author: "列夫·托尔斯泰",
      country: "俄罗斯",
      publicationYear: 1869,
      category: "经典文学",
      totalPages: 1225,
      currentPage: 0,
      status: "want",
      rating: 0,
      notes: "",
    }),
    make(4, {
      title: "1984",
      author: "George Orwell",
      country: "英国",
      publicationYear: 1949,
      category: "反乌托邦",
      totalPages: 328,
      currentPage: 328,
      status: "finished",
      rating: 5,
      notes: "Big Brother is watching you —— 经典中的经典。",
      finishedAt: now - 200 * day,
    }),
    make(5, {
      title: "傲慢与偏见",
      author: "Jane Austen",
      country: "英国",
      publicationYear: 1813,
      category: "经典文学",
      totalPages: 432,
      currentPage: 0,
      status: "want",
      rating: 0,
      notes: "",
    }),
    make(6, {
      title: "Atomic Habits",
      author: "James Clear",
      country: "美国",
      publicationYear: 2018,
      category: "自我提升",
      totalPages: 320,
      currentPage: 120,
      status: "reading",
      rating: 4,
      notes: "1% 的改进每天都积累，复利效应清晰直观。",
      startedAt: now - 10 * day,
    }),
    make(7, {
      title: "设计模式：可复用面向对象软件的基础",
      author: "Erich Gamma 等",
      country: "美国",
      publicationYear: 1994,
      category: "计算机科学",
      totalPages: 395,
      currentPage: 395,
      status: "finished",
      rating: 4,
      notes: "GoF 经典，需要结合实际工程读才有体会。",
      finishedAt: now - 60 * day,
    }),
    make(8, {
      title: "深入理解计算机系统",
      author: "Bryant & O'Hallaron",
      country: "美国",
      publicationYear: 2002,
      category: "计算机科学",
      totalPages: 780,
      currentPage: 320,
      status: "reading",
      rating: 5,
      notes: "从硬件到操作系统的完整链路，CSAPP 配套实验非常硬核。",
      startedAt: now - 30 * day,
    }),
    make(9, {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt & David Thomas",
      country: "美国",
      publicationYear: 1999,
      category: "计算机科学",
      totalPages: 320,
      currentPage: 0,
      status: "want",
      rating: 0,
      notes: "",
    }),
    make(10, {
      title: "挪威的森林",
      author: "村上春树",
      country: "日本",
      publicationYear: 1987,
      category: "当代文学",
      totalPages: 296,
      currentPage: 0,
      status: "want",
      rating: 0,
      notes: "",
    }),
    make(11, {
      title: "百年孤独",
      author: "加西亚·马尔克斯",
      country: "哥伦比亚",
      publicationYear: 1967,
      category: "魔幻现实主义",
      totalPages: 417,
      currentPage: 417,
      status: "finished",
      rating: 5,
      notes: "布恩迪亚家族七代人的命运，魔幻现实主义的代表作。",
      finishedAt: now - 150 * day,
    }),
    make(12, {
      title: "人类简史",
      author: "尤瓦尔·赫拉利",
      country: "以色列",
      publicationYear: 2011,
      category: "历史",
      totalPages: 443,
      currentPage: 443,
      status: "finished",
      rating: 4,
      notes: "从认知革命到未来展望，跨学科叙事极具启发性。",
      finishedAt: now - 120 * day,
    }),
  ];
  saveBooks(sample);
  return sample;
}
