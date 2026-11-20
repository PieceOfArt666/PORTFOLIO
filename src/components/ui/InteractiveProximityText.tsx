import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticTitleProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // How far the text moves (default: 20)
  rotationStrength?: number; // How much it tilts (default: 6)
}

/**
 * Magnetic container that smoothly shifts and tilts towards the mouse cursor
 * when the mouse moves near it. Uses direct motion values for 60fps performance (zero re-renders).
 */
export function MagneticText({
  children,
  className = '',
  strength = 18,
  rotationStrength = 4,
}: MagneticTitleProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, buoyant spring physics
  const springConfig = { damping: 15, stiffness: 180, mass: 0.2 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotate = useTransform(x, [-strength, strength], [-rotationStrength, rotationStrength]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Normalize and scale displacement within bounds
    const clampedX = Math.max(-strength, Math.min(strength, distanceX * 0.22));
    const clampedY = Math.max(-strength, Math.min(strength, distanceY * 0.22));

    mouseX.set(clampedX);
    mouseY.set(clampedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, rotate }}
      className={`inline-block cursor-default will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

interface BouncyInteractiveHeadingProps {
  text: string;
  className?: string;
  dropShadowColor?: string;
}

/**
 * 2D Nintendo Letter-by-Letter Bouncy Title.
 * Each letter pops, squashes, and tilts playfully when the mouse moves near or over it.
 */
export function BouncyInteractiveHeading({
  text,
  className = '',
  dropShadowColor = 'var(--theme-primary)',
}: BouncyInteractiveHeadingProps) {
  const letters = text.split('');

  return (
    <span className={`inline-flex flex-nowrap items-baseline select-none whitespace-nowrap max-w-full ${className}`}>
      {letters.map((char, index) => {
        if (char === ' ') {
          return <span key={index} className="inline-block w-2 sm:w-3 md:w-4">&nbsp;</span>;
        }

        return (
          <motion.span
            key={index}
            className="inline-block relative will-change-transform cursor-pointer"
            style={{
              textShadow: `4px 4px 0px ${dropShadowColor}`,
            }}
            whileHover={{
              y: -14,
              scale: 1.18,
              rotate: (index % 2 === 0 ? -6 : 6),
              transition: { type: 'spring', stiffness: 450, damping: 12 },
            }}
            animate={{
              y: 0,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 18,
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}

interface ProximityWordProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Playful word-level hover nudging for subtitles and interactive copy.
 */
export function ProximityNudgeText({ children, className = '' }: ProximityWordProps) {
  return (
    <motion.span
      className={`inline-block will-change-transform cursor-pointer transition-colors ${className}`}
      whileHover={{
        scale: 1.06,
        y: -4,
        rotate: [-1, 1.5, 0],
        transition: { type: 'spring', stiffness: 400, damping: 14 },
      }}
    >
      {children}
    </motion.span>
  );
}
