import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ProductCard from "../components/product-card";
import PageTitle from "../components/page-title";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { addWishlistItem, removeWishlistItem } from "../redux/reducer/wishlistReducer";
import { CartItem } from "../types/types";
import { RootState, AppDispatch } from "../redux/store";

const CATEGORIES = [
    { label: "Men",         emoji: "👔", slug: "men" },
    { label: "Women",       emoji: "👗", slug: "women" },
    { label: "Kids",        emoji: "🧒", slug: "kids" },
    { label: "Ethnic",      emoji: "🥻", slug: "ethnic" },
    { label: "Western",     emoji: "🧥", slug: "western" },
    { label: "Accessories", emoji: "🧣", slug: "accessories" },
    { label: "Footwear",    emoji: "👟", slug: "footwear" },
    { label: "Sale",        emoji: "🏷️", slug: "sale" },
];

const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.userReducer);
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const recentlyViewed = useSelector((state: RootState) => state.recentlyViewed.items);

    const { data, isLoading, isError } = useLatestProductsQuery("");

    if (isError) toast.error("Cannot fetch products");

    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock");
        dispatch(addToCart(cartItem));
        toast.success("Added to bag!");
    };

    const toggleWishlist = useCallback((productId: string) => {
        if (!user?._id) return toast.error("Please log in");
        const product =
            data?.products.find((p) => p._id === productId) ??
            recentlyViewed.find((p) => p._id === productId);
        if (!product) return;
        const isWishlisted = wishlistItems.some((p) => p._id === productId);
        if (isWishlisted) {
            dispatch(removeWishlistItem({ userId: user._id, productId }));
            toast.success("Removed from wishlist");
        } else {
            dispatch(addWishlistItem({ userId: user._id, product }));
            toast.success("Added to wishlist");
        }
    }, [user, wishlistItems, data, recentlyViewed, dispatch]);

    const skeletons = Array.from({ length: 5 });

    return (
        <div className="home-page">
            <PageTitle title="Home" />

            {/* Hero banner */}
            <section className="hero-banner">
                <div className="hero-slide">
                    <div className="hero-text">
                        <p className="hero-tag">New Collection</p>
                        <h1>Style That<br />Speaks You</h1>
                        <p className="hero-sub">Discover the latest fashion for every occasion</p>
                        <Link to="/search" className="hero-cta">Shop Now</Link>
                    </div>
                    <div className="hero-image-block" />
                </div>
            </section>

            {/* Category tiles */}
            <section className="section-wrap">
                <div className="section-header">
                    <h2>Shop by Category</h2>
                </div>
                <div className="category-tiles">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.slug} to={`/search?category=${cat.slug}`} className="category-tile">
                            <span className="tile-emoji">{cat.emoji}</span>
                            <span className="tile-label">{cat.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Latest products masonry */}
            <section className="section-wrap">
                <div className="section-header">
                    <h2>New Arrivals</h2>
                    <Link to="/search" className="view-all">View All</Link>
                </div>
                <div className="masonry-grid">
                    {isLoading
                        ? skeletons.map((_, i) => <div key={i} className="card-skeleton" />)
                        : data?.products.map((product) => (
                            <ProductCard
                                key={product._id}
                                productId={product._id}
                                name={product.name}
                                price={product.price}
                                stock={product.stock}
                                photo={product.photo}
                                category={product.category}
                                handler={addToCartHandler}
                                isWishlisted={wishlistItems.some((p) => p._id === product._id)}
                                onWishlistToggle={toggleWishlist}
                            />
                        ))}
                </div>
            </section>

            {/* Promo banner */}
            <section className="promo-banner">
                <div className="promo-inner">
                    <h2>End of Season Sale</h2>
                    <p>Up to 50% off on selected styles. Limited time only.</p>
                    <Link to="/search?category=sale" className="promo-cta">Explore Sale</Link>
                </div>
            </section>

            {/* Recently viewed */}
            {recentlyViewed.length > 0 && (
                <section className="section-wrap">
                    <div className="section-header">
                        <h2>Recently Viewed</h2>
                    </div>
                    <div className="masonry-grid">
                        {recentlyViewed.map((product) => (
                            <ProductCard
                                key={product._id}
                                productId={product._id}
                                name={product.name}
                                price={product.price}
                                stock={product.stock}
                                photo={product.photo}
                                category={product.category}
                                handler={addToCartHandler}
                                isWishlisted={wishlistItems.some((p) => p._id === product._id)}
                                onWishlistToggle={toggleWishlist}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
