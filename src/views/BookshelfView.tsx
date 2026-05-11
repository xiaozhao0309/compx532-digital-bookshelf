import { useMemo } from "react";
import type { Book } from "../types/book";
import { Bookshelf } from "../components/Bookshelf";
import { GroupingToggle } from "../components/GroupingToggle";
import { groupBooks, type GroupKey } from "../utils/grouping";

interface BookshelfViewProps {
  books: Book[];
  groupBy: GroupKey;
  onGroupChange: (key: GroupKey) => void;
  visibleIds: Set<string>;
  selectedId: string | null;
  onSelectBook: (book: Book) => void;
  yearRange: { min: number; max: number };
}

export function BookshelfView({
  books,
  groupBy,
  onGroupChange,
  visibleIds,
  selectedId,
  onSelectBook,
  yearRange,
}: BookshelfViewProps) {
  const groups = useMemo(() => groupBooks(books, groupBy), [books, groupBy]);

  return (
    <div className="view view--bookshelf">
      <GroupingToggle value={groupBy} onChange={onGroupChange} />
      <Bookshelf
        groups={groups}
        visibleIds={visibleIds}
        selectedId={selectedId}
        onSelect={onSelectBook}
        yearRange={yearRange}
      />
    </div>
  );
}
