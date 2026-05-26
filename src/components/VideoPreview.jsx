import { useRef } from "react";
import gsap from "gsap";

// Wrapper that applies a subtle cursor-tracking tilt to the mini video preview.
// Used in Hero as <VideoPreview>{video}</VideoPreview> — no props beyond children.
export const VideoPreview = ({ children }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const relX = (clientX - left) / width - 0.5;
    const relY = (clientY - top) / height - 0.5;

    gsap.to(contentRef.current, {
      rotationY: relX * 10,
      rotationX: -relY * 10,
      transformPerspective: 500,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(contentRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.3,
      ease: "power1.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute z-50 size-full"
    >
      <div ref={contentRef} className="origin-center size-full">
        {children}
      </div>
    </section>
  );
};
