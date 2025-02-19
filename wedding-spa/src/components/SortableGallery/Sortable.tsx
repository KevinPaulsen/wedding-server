// Sortable.jsx
import React, { cloneElement } from "react";
import { useSortable } from "@dnd-kit/sortable";

interface SortableProps {
  id: string;
  children: React.ReactElement;
}

const Sortable: React.FC<SortableProps> = ({ id, children }) => {
  const { attributes, listeners, isDragging, setNodeRef } = useSortable({ id });

  return cloneElement(children as React.ReactElement<any>, {
    ref: setNodeRef,
    "data-active": isDragging,
    ...attributes,
    ...listeners,
  });
};

export default Sortable;
