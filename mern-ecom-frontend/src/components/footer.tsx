import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => (
    <footer className="site-footer">
        <div className="footer-top">
            <div className="footer-brand">
                <div className="footer-logo">
                    <span className="logo-buy">BUY</span>
                    <span className="logo-osphere">OSPHERE</span>
                </div>
                <p>Your one-stop destination for fashion — from everyday essentials to statement pieces.</p>
                <div className="footer-social">
                    <a href="#" aria-label="Instagram"><FaInstagram /></a>
                    <a href="#" aria-label="Twitter"><FaTwitter /></a>
                    <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                    <a href="#" aria-label="YouTube"><FaYoutube /></a>
                </div>
            </div>

            <div className="footer-links">
                <div>
                    <h4>Shop</h4>
                    <Link to="/search?category=men">Men</Link>
                    <Link to="/search?category=women">Women</Link>
                    <Link to="/search?category=kids">Kids</Link>
                    <Link to="/search?category=accessories">Accessories</Link>
                    <Link to="/search?category=sale">Sale</Link>
                </div>
                <div>
                    <h4>Help</h4>
                    <Link to="/orders">Track Order</Link>
                    <Link to="/cart">My Cart</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <a href="#">Returns & Exchanges</a>
                    <a href="#">FAQs</a>
                </div>
                <div>
                    <h4>Company</h4>
                    <a href="#">About Us</a>
                    <a href="#">Careers</a>
                    <a href="#">Press</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </div>

        <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Buyosphere. All rights reserved.</p>
            <p>Made with ♥ in India</p>
        </div>
    </footer>
);

export default Footer;
