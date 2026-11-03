import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import { server } from "../../redux/store";
import { Product } from "../../types/types";

type HeroSectionProps = {
    products: Product[];
};

const HEADLINE_WORDS = ["Style", "that", "speaks", "you."];

const HeroSection = ({ products }: HeroSectionProps) => {
    const prefersReducedMotion = useReducedMotion();
    const badgePathId = useId();
    const heroRef = useRef<HTMLDivElement>(null);
    const [showScrollCue, setShowScrollCue] = useState(true);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const archY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -50]);
    const circleY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -110]);
    const blockY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -30]);

    useEffect(() => {
        const onScroll = () => setShowScrollCue(window.scrollY < 80);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const imageFor = (index: number) =>
        products[index] ? `${server}/${products[index].photo}` : undefined;

    const archImage = imageFor(0);
    const circleImage = imageFor(1);
    const blockImage = imageFor(2);

    return (
        <section className="bh-hero" ref={heroRef}>
            <div className="bh-hero__inner">
                <div className="bh-hero__copy">
                    <span className="bh-hero__eyebrow">New collection</span>
                    <h1 className="bh-hero__headline">
                        {HEADLINE_WORDS.map((word, i) => (
                            <span className="bh-hero__word-mask" key={word}>
                                <motion.span
                                    className={
                                        word === "you."
                                            ? "bh-hero__word bh-hero__word--accent"
                                            : "bh-hero__word"
                                    }
                                    initial={prefersReducedMotion ? undefined : { y: "110%" }}
                                    animate={prefersReducedMotion ? undefined : { y: "0%" }}
                                    transition={{
                                        duration: 0.7,
                                        delay: 0.15 + i * 0.12,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    {word}
                                </motion.span>
                            </span>
                        ))}
                    </h1>
                    <p className="bh-hero__sub">Discover the latest fashion for every occasion.</p>
                    <Link to="/search" className="bh-hero__cta">
                        Shop now <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>

                <div className="bh-hero__visual">
                    <motion.div
                        className="bh-hero__shape bh-hero__shape--arch"
                        style={{ y: archY }}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.85 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        {archImage && <img src={archImage} alt="" />}
                    </motion.div>

                    <motion.div
                        className="bh-hero__shape bh-hero__shape--circle"
                        style={{ y: circleY }}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.85 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
                    >
                        {circleImage && <img src={circleImage} alt="" />}
                    </motion.div>

                    <motion.div
                        className="bh-hero__shape bh-hero__shape--block"
                        style={{ y: blockY }}
                        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.85 }}
                        animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    >
                        {blockImage && <img src={blockImage} alt="" />}
                    </motion.div>

                    <motion.div
                        className="bh-hero__badge"
                        animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    >
                        <svg viewBox="0 0 120 120" aria-hidden="true">
                            <defs>
                                <path
                                    id={badgePathId}
                                    d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                                />
                            </defs>
                            <text fontSize="9" letterSpacing="2">
                                <textPath href={`#${badgePathId}`}>
                                    NEW SEASON &bull; NEW SEASON &bull;
                                </textPath>
                            </text>
                        </svg>
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {showScrollCue && (
                    <motion.div
                        className="bh-hero__scroll-cue"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.span
                            className="bh-hero__scroll-arrow"
                            animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            &darr;
                        </motion.span>
                        <span className="bh-hero__scroll-label">Scroll</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default HeroSection;
