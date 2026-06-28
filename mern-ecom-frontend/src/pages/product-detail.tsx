import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import PageTitle from "../components/page-title";
import StarRating from "../components/star-rating";
import { useProductDetailsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { addRecentlyViewed } from "../redux/reducer/recentlyViewedReducer";
import { addWishlistItem, removeWishlistItem } from "../redux/reducer/wishlistReducer";
import { fetchReviews, submitReview, removeReview, Review } from "../services/reviewService";
import { RootState, AppDispatch, server } from "../redux/store";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.userReducer);
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

    const { data, isLoading, isError } = useProductDetailsQuery(id!);
    const product = data?.product;

    const isWishlisted = wishlistItems.some((p) => p._id === id);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchReviews(id).then((res) => {
            setReviews(res.reviews);
            setAvgRating(res.ratings);
        }).catch(() => {});
    }, [id]);

    useEffect(() => {
        if (product) dispatch(addRecentlyViewed(product));
    }, [product, dispatch]);

    if (isLoading) return <div className="loader"><div /></div>;
    if (isError || !product) {
        toast.error("Could not load product");
        return null;
    }

    const addToCartHandler = () => {
        if (product.stock < 1) return toast.error("Out of Stock");
        dispatch(addToCart({
            productId: product._id,
            photo: product.photo,
            name: product.name,
            price: product.price,
            stock: product.stock,
            quantity: 1,
        }));
        toast.success("Added to cart!");
    };

    const toggleWishlist = () => {
        if (!user?._id) return toast.error("Please log in");
        if (isWishlisted) {
            dispatch(removeWishlistItem({ userId: user._id, productId: product._id }));
            toast.success("Removed from wishlist");
        } else {
            dispatch(addWishlistItem({ userId: user._id, product }));
            toast.success("Added to wishlist");
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?._id) return toast.error("Please log in to review");
        if (userRating === 0) return toast.error("Please select a rating");
        setSubmitting(true);
        try {
            await submitReview(product._id, { rating: userRating, comment, userId: user._id });
            const res = await fetchReviews(product._id);
            setReviews(res.reviews);
            setAvgRating(res.ratings);
            setUserRating(0);
            setComment("");
            toast.success("Review submitted!");
        } catch {
            toast.error("Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!user?._id) return;
        try {
            await removeReview(product._id, user._id);
            const res = await fetchReviews(product._id);
            setReviews(res.reviews);
            setAvgRating(res.ratings);
            toast.success("Review deleted");
        } catch {
            toast.error("Failed to delete review");
        }
    };

    const existingUserReview = reviews.find((r) => r.user === user?._id);

    return (
        <div className="product-detail-page">
            <PageTitle title={product.name} />

            <section className="product-detail-hero">
                <img src={`${server}/${product.photo}`} alt={product.name} />
                <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    <div className="product-meta">
                        <StarRating rating={avgRating} size="1.2rem" />
                        <span className="rating-count">({reviews.length} reviews)</span>
                    </div>
                    <p className="product-price">₹{product.price.toLocaleString("en-IN")}</p>
                    <p className={`stock-status ${product.stock < 1 ? "out" : "in"}`}>
                        {product.stock < 1 ? "Out of Stock" : `In Stock (${product.stock})`}
                    </p>
                    <p className="product-category">{product.category}</p>

                    <div className="product-actions">
                        <button className="btn-cart" onClick={addToCartHandler} disabled={product.stock < 1}>
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button className="btn-wishlist" onClick={toggleWishlist} aria-label="Wishlist">
                            {isWishlisted ? <FaHeart className="heart-filled" /> : <FaRegHeart />}
                        </button>
                    </div>
                </div>
            </section>

            <section className="review-section">
                <h2>Customer Reviews</h2>

                {!existingUserReview && user?._id && (
                    <form className="review-form" onSubmit={handleSubmitReview}>
                        <h3>Write a Review</h3>
                        <div className="star-select">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star interactive ${star <= (hoverRating || userRating) ? "star-filled" : "star-empty"}`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setUserRating(star)}
                                    role="button"
                                    aria-label={`${star} stars`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Share your thoughts..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                        />
                        <button type="submit" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                )}

                <div className="review-list">
                    {reviews.length === 0 ? (
                        <p className="no-reviews">No reviews yet. Be the first!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="review-card">
                                <StarRating rating={review.rating} size="0.9rem" />
                                <p className="review-comment">{review.comment}</p>
                                <span className="review-date">
                                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                                </span>
                                {review.user === user?._id && (
                                    <button className="btn-delete-review" onClick={handleDeleteReview}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;
