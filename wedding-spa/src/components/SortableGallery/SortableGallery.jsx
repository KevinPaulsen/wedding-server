// SortableGallery.jsx
import React, {useRef, useState} from "react";
import {
  closestCenter, DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import {SortableContext, sortableKeyboardCoordinates} from "@dnd-kit/sortable";

import Sortable from "./Sortable";
import Overlay from "./Overlay";

import classes from "./SortableGallery.module.css";

export default function SortableGallery({
    gallery: Gallery,
    photos: photoSet,
    movePhoto,
    handleDelete,
    render,
    ...rest
}) {
  const ref = useRef(null);
  const [activePhoto, setActivePhoto] = useState();

  const sensors = useSensors(
          useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
          useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } }),
          useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Add an id to each photo based on key or src
  const photos = photoSet.map((photo) => ({ ...photo, id: photo.key || photo.src }));

  const handleDragStart = ({ active }) => {
    const photo = photos.find((item) => item.id === active.id);
    const image = ref.current?.querySelector(`img[src="${photo?.src}"]`);
    const padding = image?.parentElement ? getComputedStyle(image.parentElement).padding : undefined;
    const { width, height } = image?.getBoundingClientRect() || {};

    if (photo && width !== undefined && height !== undefined) {
      setActivePhoto({ photo, width, height, padding });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      movePhoto(
              photos.findIndex((photo) => photo.id === active.id),
              photos.findIndex((photo) => photo.id === over.id)
      );
    }
    setActivePhoto(undefined);
  };

  const renderSortable = (Component, index, photo, props) => (
          <Sortable key={index} id={photo.id}>
            <Component {...props} />
          </Sortable>
  );

  return (
          <DndContext
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  collisionDetection={closestCenter}
          >
            <SortableContext items={photos}>
              <div className={classes.gallery}>
                <Gallery
                        ref={ref}
                        photos={photos}
                        render={{
                          ...render,
                          // Wrap each photo in a sortable div as before:
                          wrapper: (props, { index, photo }) =>
                                  renderSortable("div", index, photo, props),
                          // Add an 'extras' render function to overlay a button:
                          extras: (props, { index, photo }) => (
                                  <button
                                          className={classes.extraButton}
                                          onClick={(event) => handleDelete(photo, event)}
                                          style={{color: "var(--accent-text)"}}
                                  >
                                    X
                                  </button>
                          ),
                        }}
                        {...rest}
                />
              </div>
            </SortableContext>

            <DragOverlay>
              {activePhoto && <Overlay className={classes.overlay} {...activePhoto} />}
            </DragOverlay>
          </DndContext>);
}
