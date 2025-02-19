// SortableGallery.jsx
import React, { useRef, useState } from "react";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Sortable from "./Sortable";
import Overlay from "./Overlay";
import classes from "./SortableGallery.module.css";

interface Photo {
    src: string;
    key?: string;
    imageId: string;
    [key: string]: any;
}

interface SortableGalleryProps {
    gallery: React.ElementType;
    photos: Photo[];
    movePhoto: (oldIndex: number, newIndex: number) => void;
    handleDelete: (photo: Photo, event: React.MouseEvent<HTMLButtonElement>) => void;
    render?: any;
    [key: string]: any;
}

export default function SortableGallery({
                                            gallery: Gallery,
                                            photos: photoSet,
                                            movePhoto,
                                            handleDelete,
                                            render,
                                            ...rest
                                        }: SortableGalleryProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [activePhoto, setActivePhoto] = useState<any>(undefined);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const photos = photoSet.map((photo) => ({ ...photo, id: photo.key || photo.src }));

    const handleDragStart = ({ active }: any) => {
        const photo = photos.find((item) => item.id === active.id);
        const image = ref.current?.querySelector(`img[src="${photo?.src}"]`) as HTMLImageElement | null;
        const padding = image?.parentElement ? getComputedStyle(image.parentElement).padding : undefined;
        const rect = image?.getBoundingClientRect();
        const width = rect?.width;
        const height = rect?.height;

        if (photo && width !== undefined && height !== undefined) {
            setActivePhoto({ photo, width, height, padding });
        }
    };

    const handleDragEnd = ({ active, over }: any) => {
        if (over && active.id !== over.id) {
            movePhoto(
                photos.findIndex((photo) => photo.id === active.id),
                photos.findIndex((photo) => photo.id === over.id)
            );
        }
        setActivePhoto(undefined);
    };

    const renderSortable = (Component: any, index: number, photo: Photo, props: any) => (
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
                            wrapper: (props: any, { index, photo }: any) =>
                                renderSortable("div", index, photo, props),
                            extras: (props: any, { photo }: any) => (
                                <button
                                    className={classes.extraButton}
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleDelete(photo, event)}
                                    style={{ color: "var(--accent-text)" }}
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
        </DndContext>
    );
}
