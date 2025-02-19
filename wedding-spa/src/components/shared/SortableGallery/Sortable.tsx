import React, {cloneElement} from "react";
import {useSortable} from "@dnd-kit/sortable";

interface SortableProps {
  id: string;
  children: React.ReactElement;
}

export default function Sortable({ id, children }: SortableProps) {
  const { attributes, listeners, isDragging, index, activeIndex, over, setNodeRef } = useSortable({ id });

  return cloneElement(children as React.ReactElement<any>, {
    ref: setNodeRef,
    "data-active": isDragging,
    "data-position":
        activeIndex >= 0 && over?.id === id && !isDragging
            ? index > activeIndex
                ? "after"
                : "before"
            : undefined,
    ...attributes,
    ...listeners,
  });
}
