import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const SaleReveal = () => {
    const prefersReducedMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref });

    const scale = useTransform(scrollYProgress, [0, 0.7], [0.12, 4.8]);
    const textOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
    const textY = useTransform(scrollYProgress, [0.55, 0.8], [24, 0]);

    if (prefersReducedMotion) {
        return (
            <section className="bh-sale bh-sale--static">
                <div className="bh-sale__content">
                    <h2>End of Season Sale</h2>
                    <p>Up to 50% off on selected styles. Limited time only.</p>
                    <Link to="/search?category=sale" className="bh-sale__cta">
                        Explore Sale <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bh-sale" ref={ref}>
            <div className="bh-sale__stage">
                <motion.div className="bh-sale__circle" style={{ scale }} />
                <motion.div
                    className="bh-sale__content"
                    style={{ opacity: textOpacity, y: textY }}
                >
                    <h2>End of Season Sale</h2>
                    <p>Up to 50% off on selected styles. Limited time only.</p>
                    <Link to="/search?category=sale" className="bh-sale__cta">
                        Explore Sale <span aria-hidden="true">&rarr;</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default SaleReveal;
