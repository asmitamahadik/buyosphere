import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingBag, FaSignOutAlt, FaUser, FaSearch, FaTimes, FaBars } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { User } from "../types/types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface PropsType {
    user: User | null;
}

const CATEGORIES = ["Men", "Women", "Kids", "Ethnic", "Western", "Accessories", "Footwear", "Sale"];

const Header = ({ user }: PropsType) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const navigate = useNavigate();
    const cartItems = useSelector((state: RootState) => state.cartReducer.cartItems);

    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Signed out successfully!");
            setUserOpen(false);
        } catch {
            toast.error("Sign out failed");
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    return (
        <header className="site-header">
            {/* Announcement bar */}
            <div className="announcement-bar">
                <span>Free shipping on orders above ₹999</span>
                <span className="sep">|</span>
                <span>Use code <strong>STYLE10</strong> for 10% off your first order</span>
                <span className="sep">|</span>
                <span>New arrivals every week</span>
            </div>

            {/* Main header */}
            <div className="header-main">
                <Link to="/" className="site-logo">
                    <span className="logo-buy">BUY</span>
                    <span className="logo-osphere">OSPHERE</span>
                </Link>

                <form className="header-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search for clothes, brands & more..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" aria-label="Search">
                        <FaSearch />
                    </button>
                    {searchQuery && (
                        <button
                            type="button"
                            className="clear-search"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear"
                        >
                            <FaTimes />
                        </button>
                    )}
                </form>

                <div className="header-actions">
                    {user?._id ? (
                        <div className="user-menu">
                            <button
                                className="action-btn"
                                onClick={() => setUserOpen((p) => !p)}
                                aria-label="Account"
                            >
                                <FaUser />
                                <span>Account</span>
                            </button>
                            {userOpen && (
                                <div className="user-dropdown">
                                    <p className="user-name">{user.name}</p>
                                    {user.role === "admin" && (
                                        <Link to="/admin/dashboard" onClick={() => setUserOpen(false)}>Admin Panel</Link>
                                    )}
                                    <Link to="/orders" onClick={() => setUserOpen(false)}>My Orders</Link>
                                    <Link to="/wishlist" onClick={() => setUserOpen(false)}>Wishlist</Link>
                                    <button onClick={logoutHandler}>
                                        <FaSignOutAlt /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="action-btn">
                            <FaUser />
                            <span>Sign In</span>
                        </Link>
                    )}

                    {user?._id && (
                        <Link to="/wishlist" className="action-btn">
                            <FaHeart />
                            <span>Wishlist</span>
                        </Link>
                    )}

                    <Link to="/cart" className="action-btn cart-btn">
                        <FaShoppingBag />
                        {cartItems.length > 0 && (
                            <span className="cart-badge">{cartItems.length}</span>
                        )}
                        <span>Cart</span>
                    </Link>
                </div>

                <button className="mobile-menu-btn" onClick={() => setMenuOpen((p) => !p)} aria-label="Menu">
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Category nav */}
            <nav className={`category-nav ${menuOpen ? "open" : ""}`}>
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat}
                        to={`/search?category=${cat.toLowerCase()}`}
                        className={cat === "Sale" ? "sale-link" : ""}
                        onClick={() => setMenuOpen(false)}
                    >
                        {cat}
                    </Link>
                ))}
            </nav>
        </header>
    );
};

export default Header;
