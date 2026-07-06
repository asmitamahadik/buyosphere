import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeartBroken } from "react-icons/fa";
import ProductCard from "../components/product-card";
import PageTitle from "../components/page-title";
import { addToCart } from "../redux/reducer/cartReducer";
import { loadWishlist, removeWishlistItem } from "../redux/reducer/wishlistReducer";
import { CartItem } from "../types/types";
import { RootState } from "../redux/store";
import { AppDispatch } from "../redux/store";

const Wishlist = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.userReducer);
    const { items, loading } = useSelector((state: RootState) => state.wishlist);

    useEffect(() => {
        if (user?._id) dispatch(loadWishlist(user._id));
    }, [user?._id, dispatch]);

    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock");
        dispatch(addToCart(cartItem));
        toast.success("Added to cart!");
    };

    const removeFromWishlistHandler = (productId: string) => {
        if (!user?._id) return;
        dispatch(removeWishlistItem({ userId: user._id, productId }));
        toast.success("Removed from wishlist");
    };

    if (loading) return <div className="loader"><div /></div>;

    return (
        <div className="wishlist-page">
            <PageTitle title="My Wishlist" />
            <h1>My Wishlist</h1>

            {items.length === 0 ? (
                <div className="empty-state">
                    <FaHeartBroken />
                    <p>Your wishlist is empty.</p>
                    <Link to="/search">Browse Products</Link>
                </div>
            ) : (
                <main className="wishlist-grid">
                    {items.map((product) => (
                        <ProductCard
                            key={product._id}
                            productId={product._id}
                            name={product.name}
                            price={product.price}
                            stock={product.stock}
                            photo={product.photo}
                            handler={addToCartHandler}
                            isWishlisted={true}
                            onWishlistToggle={removeFromWishlistHandler}
                        />
                    ))}
                </main>
            )}
        </div>
    );
};

export default Wishlist;
