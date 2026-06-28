import { memo } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
    rating: number;
    max?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
    size?: string;
}

const StarRating = memo(({ rating, max = 5, interactive = false, onRate, size = "1rem" }: StarRatingProps) => {
    return (
        <div className="star-rating" style={{ fontSize: size }}>
            {Array.from({ length: max }, (_, i) => {
                const full = i + 1 <= rating;
                const half = !full && i + 0.5 <= rating;
                return (
                    <span
                        key={i}
                        className={interactive ? "star interactive" : "star"}
                        onClick={() => interactive && onRate?.(i + 1)}
                        role={interactive ? "button" : undefined}
                        aria-label={`${i + 1} star`}
                    >
                        {full ? (
                            <FaStar className="star-filled" />
                        ) : half ? (
                            <FaStarHalfAlt className="star-half" />
                        ) : (
                            <FaRegStar className="star-empty" />
                        )}
                    </span>
                );
            })}
        </div>
    );
});

StarRating.displayName = "StarRating";

export default StarRating;
