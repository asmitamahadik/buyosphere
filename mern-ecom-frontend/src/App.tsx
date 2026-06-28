import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Loader from "./components/loader";
import "./styles/app.scss";
import Header from "./components/header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { getUser } from "./redux/api/userAPI";
import { UserReducerInitialState } from "./types/reducer-types";
import ProtectedRoute from "./components/protected-route";
import { AppDispatch } from "./redux/store";
import { loadWishlist } from "./redux/reducer/wishlistReducer";

const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/search"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Orders = lazy(() => import("./pages/orders"));
const OrderDetail = lazy(() => import("./pages/order-detail"));
const ProductDetail = lazy(() => import("./pages/product-detail"));
const Wishlist = lazy(() => import("./pages/wishlist"));
const NotFound = lazy(() => import("./pages/not-found"));
const Checkout = lazy(() => import("./pages/checkout"));

const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(() => import("./pages/admin/management/productmanagement"));
const TransactionManagement = lazy(() => import("./pages/admin/management/transactionmanagement"));

const App = () => {
    const { user, loading } = useSelector(
        (state: { userReducer: UserReducerInitialState }) => state.userReducer
    );
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const data = await getUser(firebaseUser.uid);
                dispatch(userExist(data.user));
                dispatch(loadWishlist(firebaseUser.uid));
            } else {
                dispatch(userNotExist());
            }
        });
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <Router>
            <Header user={user} />
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/product/:id" element={<ProductDetail />} />

                    <Route
                        path="/login"
                        element={
                            <ProtectedRoute isAuthenticated={user ? false : true}>
                                <Login />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        element={
                            <ProtectedRoute
                                isAuthenticated={user ? true : false}
                                redirect="/login"
                            />
                        }
                    >
                        <Route path="/shipping" element={<Shipping />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/order/:id" element={<OrderDetail />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/pay" element={<Checkout />} />
                    </Route>

                    <Route
                        element={
                            <ProtectedRoute
                                isAuthenticated={true}
                                adminOnly={true}
                                admin={user?.role === "admin" ? true : false}
                            />
                        }
                    >
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/product" element={<Products />} />
                        <Route path="/admin/customer" element={<Customers />} />
                        <Route path="/admin/transaction" element={<Transaction />} />
                        <Route path="/admin/chart/bar" element={<Barcharts />} />
                        <Route path="/admin/chart/pie" element={<Piecharts />} />
                        <Route path="/admin/chart/line" element={<Linecharts />} />
                        <Route path="/admin/app/coupon" element={<Coupon />} />
                        <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
                        <Route path="/admin/app/toss" element={<Toss />} />
                        <Route path="/admin/product/new" element={<NewProduct />} />
                        <Route path="/admin/product/:id" element={<ProductManagement />} />
                        <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
            <Toaster position="top-right" />
        </Router>
    );
};

export default App;
