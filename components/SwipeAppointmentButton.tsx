"use client";

import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type SwipeAppointmentButtonProps = {
  onActivate: () => void;
  className?: string;
  style?: CSSProperties;
  compact?: boolean;
};

const HANDLE_SIZE = 58;
const TRACK_PADDING = 4;

export default function SwipeAppointmentButton({
  onActivate,
  className = "",
  style,
  compact = false,
}: SwipeAppointmentButtonProps) {
  const trackRef = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isFilled, setIsFilled] = useState(false);
  const maxTravel = useMemo(
    () => Math.max(0, trackWidth - HANDLE_SIZE - TRACK_PADDING * 2),
    [trackWidth],
  );
  const fillWidth = useTransform(x, (value) => Math.min(trackWidth, value + HANDLE_SIZE + TRACK_PADDING * 2));

  useMotionValueEvent(x, "change", (latest) => {
    setIsFilled(maxTravel > 0 && latest > maxTravel * 0.42);
  });

  useEffect(() => {
    if (!trackRef.current) return;

    const element = trackRef.current;
    const observer = new ResizeObserver(() => {
      setTrackWidth(element.getBoundingClientRect().width);
    });

    observer.observe(element);
    setTrackWidth(element.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    x.set(0);
  }, [maxTravel, x]);

  const reset = () => {
    animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const reachedEnd = info.offset.x >= maxTravel * 0.82 || info.velocity.x > 800;

    if (!reachedEnd) {
      reset();
      return;
    }

    animate(x, maxTravel, { type: "spring", stiffness: 520, damping: 34 });
    window.setTimeout(() => {
      onActivate();
      window.setTimeout(() => reset(), 180);
    }, 60);
  };

  return (
    <div className={`swipe-appointment-stack ${compact ? "compact" : ""} ${className}`.trim()} style={style}>
      <button
        ref={trackRef}
        type="button"
        className="swipe-appointment-button"
        onClick={onActivate}
        aria-label="Randevu talep ediniz"
        style={{ minWidth: compact ? "min(100%, 460px)" : undefined }}
      >
        <motion.div className="swipe-appointment-fill" style={{ width: fillWidth }} />
        <span className={`swipe-appointment-label ${isFilled ? "is-dark" : ""}`}>RANDEVU TALEP EDİNİZ</span>
        <motion.div
          className="swipe-appointment-handle"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: 0, right: maxTravel }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          onClick={(event) => event.stopPropagation()}
        >
          <span className="material-symbols-outlined">event_available</span>
        </motion.div>
      </button>
      <span className={`swipe-appointment-hint ${isFilled ? "is-dark" : ""}`}>
        <span className="swipe-appointment-hint-text">LÜTFEN KAYDIRINIZ</span>
        <span className="swipe-appointment-hint-arrow" aria-hidden="true">→</span>
      </span>
    </div>
  );
}
