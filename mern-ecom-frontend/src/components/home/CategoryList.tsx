import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

type Category = {
    label: string;
    slug: string;
};

type CategoryListProps = {
    categories: Category[];
};

const CategoryList = ({ categories }: CategoryListProps) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="bh-categories">
            {categories.map((cat, i) => (
                <motion.div
                    className="bh-categories__row"
                    key={cat.slug}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.2), ease: "easeOut" }}
                >
                    <Link to={`/search?category=${cat.slug}`} className="bh-categories__link">
                        <span className="bh-categories__panel" aria-hidden="true" />
                        <span className="bh-categories__index">{String(i + 1).padStart(2, "0")}</span>
                        <span className="bh-categories__name">{cat.label}</span>
                        <span className="bh-categories__arrow" aria-hidden="true">&rarr;</span>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};

export default CategoryList;
