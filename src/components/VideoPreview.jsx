import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// Wrapper that applies a subtle cursor-tracking tilt to the mini video preview.
// Used in Hero as <VideoPreview>{video}</VideoPreview> — no props beyond children.
export const VideoPreview = ({ children }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  // Listeners are attached inside useGSAP and wrapped in contextSafe so the
  // tweens they create are registered with the context and reverted on
  // unmount instead of running on a detached node.
  useGSAP(
    (context, contextSafe) => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;

      const handleMouseMove = contextSafe(({ clientX, clientY }) => {
        const { left, top, width, height } = section.getBoundingClientRect();
        const relX = (clientX - left) / width - 0.5;
        const relY = (clientY - top) / height - 0.5;

        gsap.to(content, {
          rotationY: relX * 10,
          rotationX: -relY * 10,
          transformPerspective: 500,
          duration: 0.3,
          ease: "power1.out",
        });
      });

      const handleMouseLeave = contextSafe(() => {
        gsap.to(content, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      });

      section.addEventListener("mousemove", handleMouseMove);
      section.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        section.removeEventListener("mousemove", handleMouseMove);
        section.removeEventListener("mouseleave", handleMouseLeave);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="absolute z-50 size-full">
      <div ref={contentRef} className="origin-center size-full">
        {children}
      </div>
    </section>
  );
};
