import { useEffect, useMemo, useState } from "react";
import { shuffle, preloadImages } from "../../../Utils/Slideshow";

import "./BackgroundSlideshow.css";

/*
BackgroundSlideshow displays a full-screen background image slideshow
with optional custom image list and transition interval.

Props:
- images (string[] — optional): Custom list of image URLs to use in the slideshow.
  Defaults to a predefined set of 5 travel-themed images.
- intervalMs (number — optional): Time between slide changes in milliseconds.
  Defaults to 8000ms (8 seconds).

Key Features:
- Uses Fisher-Yates algorithm to randomize image order on every mount.
- Preloads all images before rotating.
- Automatically advances slides using setInterval.
- Uses CSS to animate slide transitions (only one visible at a time).
- Completely visual — `aria-hidden` and `role="presentation"` for accessibility.
*/

const DEFAULT_IMAGES = [
    "/images/home/paris.jpg",
    "/images/home/beach.jpg",
    "/images/home/thailand.jpg",
    "/images/home/thailand2.jpg",
    "/images/home/tokyo.png",
] as const;

type BackgroundSlideshowProps = {
    images?: readonly string[];
    intervalMs?: number; // default 8000
};

export function BackgroundSlideshow({
    images = DEFAULT_IMAGES,
    intervalMs = 8000
}: BackgroundSlideshowProps) {
    const slides = useMemo(() => shuffle(images), [images]);
    const [index, setIndex] = useState(0);

    useEffect(() => { preloadImages(slides); }, [slides]);

    useEffect(() => {
        if (slides.length === 0) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
        return () => clearInterval(id);
    }, [slides, intervalMs]);

    return (
        <div className="BgSlideshow" aria-hidden="true" role="presentation">
            {slides.map((src, i) => (
                <img
                    key={src}
                    src={src}
                    className={`bg-slide ${i === index ? "active" : ""}`}
                    loading="eager"
                />
            ))}
            <div className="bg-overlay" />
        </div>
    );
}
