import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ProductCard from "../components/product-card";
import PageTitle from "../components/page-title";
import HeroSection from "../components/home/HeroSection";
import Ticker from "../components/home/Ticker";
import CategoryList from "../components/home/CategoryList";
import SaleReveal from "../components/home/SaleReveal";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { addWishlistItem, removeWishlistItem } from "../redux/reducer/wishlistReducer";
import { CartItem } from "../types/types";
import { RootState, AppDispatch } from "../redux/store";
import { useLenis } from "../hooks/useLenis";

const CATEGORIES = [
    { label: "Men",         slug: "men" },
    { label: "Women",       slug: "women" },
    { label: "Kids",        slug: "kids" },
    { label: "Ethnic",      slug: "ethnic" },
    { label: "Western",     slug: "western" },
    { label: "Accessories", slug: "accessories" },
    { label: "Footwear",    slug: "footwear" },
    { label: "Sale",        slug: "sale" },
];

const Home = () => {
    useLenis();

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
        <div className="bh-home">
            <PageTitle title="Home" />

            <HeroSection products={data?.products ?? []} />

            <Ticker items={CATEGORIES.map((c) => c.label)} />

            <section className="bh-section">
                <div className="bh-section__header">
                    <h2>Shop by <em>category</em></h2>
                </div>
                <CategoryList categories={CATEGORIES} />
            </section>

            <section className="bh-section">
                <div className="bh-section__header">
                    <h2>New <em>arrivals</em></h2>
                    <Link to="/search" className="bh-view-all">View all &rarr;</Link>
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

            <SaleReveal />

            {recentlyViewed.length > 0 && (
                <section className="bh-section">
                    <div className="bh-section__header">
                        <h2>Recently <em>viewed</em></h2>
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
