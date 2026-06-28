import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ProductCard from "../components/product-card";
import PageTitle from "../components/page-title";
import { SkeletonLoader } from "../components/loader";
import HomeCarousal from "../components/home-carousal";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { addWishlistItem, removeWishlistItem } from "../redux/reducer/wishlistReducer";
import { CartItem } from "../types/types";
import { RootState, AppDispatch } from "../redux/store";

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
        toast.success("Added to cart!");
    };

    const toggleWishlist = useCallback((productId: string) => {
        if (!user?._id) return toast.error("Please log in");
        const product = data?.products.find((p) => p._id === productId)
            ?? recentlyViewed.find((p) => p._id === productId);
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

    return (
        <div className="home">
            <PageTitle title="Home" />
            <HomeCarousal />

            <h1>
                Latest Products
                <Link to="/search" className="findmore">More</Link>
            </h1>

            <main>
                {isLoading ? (
                    <SkeletonLoader width="80vw" />
                ) : (
                    data?.products.map((product) => (
                        <ProductCard
                            key={product._id}
                            productId={product._id}
                            name={product.name}
                            price={product.price}
                            stock={product.stock}
                            handler={addToCartHandler}
                            photo={product.photo}
                            isWishlisted={wishlistItems.some((p) => p._id === product._id)}
                            onWishlistToggle={toggleWishlist}
                        />
                    ))
                )}
            </main>

            {recentlyViewed.length > 0 && (
                <>
                    <h1 style={{ marginTop: "2rem" }}>Recently Viewed</h1>
                    <main>
                        {recentlyViewed.map((product) => (
                            <ProductCard
                                key={product._id}
                                productId={product._id}
                                name={product.name}
                                price={product.price}
                                stock={product.stock}
                                handler={addToCartHandler}
                                photo={product.photo}
                                isWishlisted={wishlistItems.some((p) => p._id === product._id)}
                                onWishlistToggle={toggleWishlist}
                            />
                        ))}
                    </main>
                </>
            )}
        </div>
    );
};

export default Home;
