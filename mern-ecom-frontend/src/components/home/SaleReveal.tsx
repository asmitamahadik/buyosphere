import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    type MotionValue,
} from "framer-motion";

const FLOOD_END = 0.7;
const CONTENT_START = 0.72;
const CONTENT_END = 0.88;
const MAX_RADIUS_VMAX = 150;

const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type TextBlockProps = {
    variant: "ink" | "cream";
    eyebrowOpacity?: MotionValue<number>;
    revealOpacity?: MotionValue<number>;
    revealY?: MotionValue<number>;
    revealPointerEvents?: MotionValue<"auto" | "none">;
};

const TextBlock = ({
    variant,
    eyebrowOpacity,
    revealOpacity,
    revealY,
    revealPointerEvents,
}: TextBlockProps) => {
    const suffix = variant === "cream" ? " bh-sale__eyebrow--cream" : "";
    const headlineSuffix = variant === "cream" ? " bh-sale__headline--cream" : "";

    return (
        <div className="bh-sale__textblock">
            <motion.span
                className={`bh-sale__eyebrow${suffix}`}
                style={eyebrowOpacity ? { opacity: eyebrowOpacity } : undefined}
            >
                Limited time
            </motion.span>
            <motion.h2
                className={`bh-sale__headline${headlineSuffix}`}
                style={eyebrowOpacity ? { opacity: eyebrowOpacity } : undefined}
            >
                End of Season Sale
            </motion.h2>
            <motion.div
                className="bh-sale__reveal"
                style={{
                    opacity: revealOpacity ?? 0,
                    y: revealY ?? 0,
                    pointerEvents: revealPointerEvents ?? "none",
                }}
            >
                <p className="bh-sale__subtext">
                    Up to 50% off on selected styles. Limited time only.
                </p>
                <Link to="/search?category=sale" className="bh-sale__cta">
                    Explore Sale <span aria-hidden="true">&rarr;</span>
                </Link>
            </motion.div>
        </div>
    );
};

const SaleReveal = () => {
    const prefersReducedMotion = useReducedMotion();
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const headerEl = document.querySelector<HTMLElement>(".site-header");
        const section = sectionRef.current;
        if (!headerEl || !section) return;

        const setHeaderHeight = () => {
            section.style.setProperty("--header-h", `${headerEl.offsetHeight}px`);
        };
        setHeaderHeight();

        const observer = new ResizeObserver(setHeaderHeight);
        observer.observe(headerEl);
        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const progress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        mass: 0.4,
    });

    const radiusVmax = useTransform(progress, (p) => {
        const t = Math.min(Math.max(p / FLOOD_END, 0), 1);
        return easeInOutCubic(t) * MAX_RADIUS_VMAX;
    });
    const clipPath = useTransform(radiusVmax, (r) => `circle(${r}vmax at 50% 50%)`);
    const ringSize = useTransform(radiusVmax, (r) => `${r * 2}vmax`);

    const inkOpacity = useTransform(progress, [0, FLOOD_END], [1, 0]);

    const contentOpacity = useTransform(progress, [CONTENT_START, CONTENT_END], [0, 1]);
    const contentY = useTransform(progress, [CONTENT_START, CONTENT_END], [24, 0]);
    const contentPointerEvents = useTransform(contentOpacity, (o) =>
        o > 0.9 ? "auto" : "none"
    );

    if (prefersReducedMotion) {
        return (
            <section className="bh-sale bh-sale--static">
                <div className="bh-sale__textblock">
                    <span className="bh-sale__eyebrow bh-sale__eyebrow--cream">
                        Limited time
                    </span>
                    <h2 className="bh-sale__headline bh-sale__headline--cream">
                        End of Season Sale
                    </h2>
                    <div className="bh-sale__reveal bh-sale__reveal--static">
                        <p className="bh-sale__subtext">
                            Up to 50% off on selected styles. Limited time only.
                        </p>
                        <Link to="/search?category=sale" className="bh-sale__cta">
                            Explore Sale <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bh-sale" ref={sectionRef}>
            <div className="bh-sale__stage">
                <div className="bh-sale__layer bh-sale__layer--base">
                    <TextBlock variant="ink" eyebrowOpacity={inkOpacity} />
                    <motion.div className="bh-sale__scroll-cue" style={{ opacity: inkOpacity }}>
                        <motion.span
                            className="bh-sale__scroll-arrow"
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            &darr;
                        </motion.span>
                        <span className="bh-sale__scroll-label">Scroll</span>
                    </motion.div>
                </div>

                <motion.div className="bh-sale__layer bh-sale__layer--flood" style={{ clipPath }}>
                    <TextBlock
                        variant="cream"
                        revealOpacity={contentOpacity}
                        revealY={contentY}
                        revealPointerEvents={contentPointerEvents}
                    />
                </motion.div>

                <motion.div className="bh-sale__ring" style={{ width: ringSize, height: ringSize }} />
            </div>
        </section>
    );
};

export default SaleReveal;
