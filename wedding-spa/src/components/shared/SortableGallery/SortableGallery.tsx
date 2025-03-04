// components/shared/SortableGallery/SortableGallery.tsx
import React, {JSX, useRef, useState} from "react";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
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
import { PhotoMetadata } from "../../../hooks/gallery/useGetPhotoMetadata";

// Combine PhotoMetadata with any additional optional fields
export interface Photo extends PhotoMetadata {
    key?: string;
    srcSet?: Array<{ src: string; width: number }>;
    id?: string;
}

interface ActivePhoto {
    photo: Photo;
    width: number;
    height: number;
    padding?: string;
}

interface RenderOptions {
    wrapper?: (
        props: Record<string, unknown>,
        context: { index: number; photo: Photo }
    ) => JSX.Element;
    extras?: (
        props: Record<string, unknown>,
        context: { photo: Photo }
    ) => JSX.Element;
    [key: string]: unknown;
}

interface SortableGalleryProps {
    gallery: React.ElementType;
    photos: Photo[];
    movePhoto: (oldIndex: number, newIndex: number) => void;
    handleDelete: (photo: Photo, event: React.MouseEvent<HTMLButtonElement>) => void;
    render?: RenderOptions;
    [key: string]: unknown;
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
    const [activePhoto, setActivePhoto] = useState<ActivePhoto | undefined>(undefined);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Map photos to add an "id" field (using key if available, or src otherwise)
    const photos = photoSet.map((photo) => ({ ...photo, id: photo.key || photo.src }));

    const handleDragStart = ({ active }: DragStartEvent) => {
        const photo = photos.find((item) => item.id === active.id);
        if (photo) {
            const imageSelector = `img[src="${photo.src}"]`;
            const image = ref.current?.querySelector(imageSelector) as HTMLImageElement | null;
            const padding = image?.parentElement
                ? getComputedStyle(image.parentElement).padding
                : undefined;
            const rect = image?.getBoundingClientRect();
            const width = rect?.width;
            const height = rect?.height;
            if (width !== undefined && height !== undefined) {
                setActivePhoto({ photo, width, height, padding });
            }
        }
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (over && active.id !== over.id) {
            const oldIndex = photos.findIndex((p) => p.id === active.id);
            const newIndex = photos.findIndex((p) => p.id === over.id);
            movePhoto(oldIndex, newIndex);
        }
        setActivePhoto(undefined);
    };

    const renderSortable = (
        Component: React.ElementType,
        _index: number,
        photo: Photo,
        props: Record<string, unknown>
    ) => (
        <Sortable key={photo.id} id={photo.id!}>
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
                            wrapper: (
                                props: Record<string, unknown>,
                                context: { index: number; photo: Photo }
                            ) => renderSortable("div", context.index, context.photo, props),
                            extras: (
                                props: Record<string, unknown>,
                                context: { photo: Photo }
                            ) => (
                                <button
                                    className={classes.extraButton}
                                    onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                                        handleDelete(context.photo, event)
                                    }
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
                {activePhoto && (
                    <Overlay
                        className={classes.overlay}
                        photo={activePhoto.photo}
                        width={activePhoto.width}
                        height={activePhoto.height}
                        padding={activePhoto.padding}
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
}
