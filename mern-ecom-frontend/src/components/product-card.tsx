import { memo } from "react";
import { FaHeart, FaPlus, FaRegHeart } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type ProductCardProps = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    stock: number;
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
    handler,
    isWishlisted = false,
    onWishlistToggle,
}: ProductCardProps) => {
    return (
        <div className="product-card">
            <img src={`${server}/${photo}`} alt={name} />
            <p>{name}</p>
            <span>₹{price}</span>

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

            <div>
                <button
                    onClick={() =>
                        handler({ productId, photo, name, price, stock, quantity: 1 })
                    }
                >
                    <FaPlus />
                </button>
            </div>
        </div>
    );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
