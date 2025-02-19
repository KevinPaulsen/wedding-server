import React, { cloneElement } from "react";
import { useSortable } from "@dnd-kit/sortable";

// Extend HTMLAttributes to include custom data attributes.
interface CustomHTMLAttributes<T> extends React.HTMLAttributes<T> {
  "data-active"?: boolean;
  "data-position"?: string;
}

interface SortableProps {
  id: string;
  // Require that children support our custom attributes and ref forwarding.
  children: React.ReactElement<
      CustomHTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
  >;
}

export default function Sortable({ id, children }: SortableProps) {
  const { attributes, listeners, isDragging, index, activeIndex, over, setNodeRef } =
      useSortable({ id });

  return cloneElement(children, {
    ref: setNodeRef,
    "data-active": isDragging,
    "data-position":
        activeIndex !== undefined && activeIndex >= 0 && over?.id === id && !isDragging
            ? index > activeIndex
                ? "after"
                : "before"
            : undefined,
    ...attributes,
    ...listeners,
  });
}
