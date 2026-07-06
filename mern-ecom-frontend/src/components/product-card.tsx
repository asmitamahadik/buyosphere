import { memo } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type ProductCardProps = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    stock: number;
    category?: string;
    handler: (cartItem: CartItem) => string | undefined;
    isWishlisted?: boolean;
    onWishlistToggle?: (productId: string) => void;
};

const ProductCard = memo(({
    productId,
    photo,
    name,
    price,
    stock,
    category,
    handler,
    isWishlisted = false,
    onWishlistToggle,
}: ProductCardProps) => {
    return (
        <div className="product-card">
            <Link to={`/product/${productId}`} className="card-image-wrap">
                <img src={`${server}/${photo}`} alt={name} />
                {stock < 1 && <span className="out-of-stock-badge">Out of Stock</span>}
                {category && <span className="category-badge">{category}</span>}
            </Link>

            {onWishlistToggle && (
                <button
                    className="wishlist-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onWishlistToggle(productId);
                    }}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    {isWishlisted ? <FaHeart className="heart-filled" /> : <FaRegHeart />}
                </button>
            )}

            <div className="card-info">
                <Link to={`/product/${productId}`}>
                    <p className="card-name">{name}</p>
                </Link>
                <div className="card-price-row">
                    <span className="card-price">₹{price.toLocaleString("en-IN")}</span>
                </div>
                <button
                    className="card-add-btn"
                    disabled={stock < 1}
                    onClick={() => handler({ productId, photo, name, price, stock, quantity: 1 })}
                >
                    <FaShoppingBag />
                    {stock < 1 ? "Out of Stock" : "Add to Bag"}
                </button>
            </div>
        </div>
    );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
