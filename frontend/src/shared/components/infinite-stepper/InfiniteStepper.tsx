import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import './InfiniteStepper.css'
type Props = {
  images: string[];
  width?: number; 
};

export default function InfiniteCarousel({ images, width = 300 }: Props) {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const totalImages = images.length;
  const duplicatedImages = [...images, ...images];

  useEffect(() => {
    let animationFrame: number;
    const speed = 1; 

    const move = () => {
      setPosition((prev) => {
        const next = prev + speed;
        if (next >= width * totalImages) {
          controls.set({ x: 0 });
          return 0;
        } else {
          controls.start({ x: -next, transition: { ease: "linear", duration: 0.01 } });
          return next;
        }
      });
      animationFrame = requestAnimationFrame(move);
    };

    animationFrame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationFrame);
  }, [controls, totalImages, width]);

  return (
    <div className="infinite-carrousel">
      <motion.div
        ref={containerRef}
        className="flex"
        animate={controls}
        style={{ width: `${duplicatedImages.length * width}px` }}
      >
        {duplicatedImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            className="infinite-carrousel-image"
            alt={`infinite-carrousel-${idx}`}
          />
        ))}
      </motion.div>
    </div>
  );
}
