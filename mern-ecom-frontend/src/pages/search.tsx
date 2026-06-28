import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ProductCard from "../components/product-card";
import PageTitle from "../components/page-title";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { addWishlistItem, removeWishlistItem } from "../redux/reducer/wishlistReducer";
import { RootState, AppDispatch } from "../redux/store";

const useDebounce = (value: string, delay: number) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
};

const Search = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.userReducer);
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

    const { data: categoriesResponse, isError: isCategoryError, error: categoryError, isLoading: isCategoryLoading } =
        useCategoriesQuery("");

    const [search, setSearch] = useState<string>("");
    const [sort, setSort] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<number>(100000);
    const [category, setCategory] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    const debouncedSearch = useDebounce(search, 300);

    const {
        isLoading: productLoading,
        data: searchedData,
        isError: isProductError,
        error: productError,
    } = useSearchProductsQuery({ search: debouncedSearch, sort, price: maxPrice, category, page });

    const addToCartHandler = (cartItem: CartItem) => {
        if (cartItem.stock < 1) return toast.error("Out of Stock");
        dispatch(addToCart(cartItem));
        toast.success("Added to cart!");
    };

    const toggleWishlist = useCallback((productId: string) => {
        if (!user?._id) return toast.error("Please log in");
        const product = searchedData?.products.find((p) => p._id === productId);
        if (!product) return;
        const isWishlisted = wishlistItems.some((p) => p._id === productId);
        if (isWishlisted) {
            dispatch(removeWishlistItem({ userId: user._id, productId }));
            toast.success("Removed from wishlist");
        } else {
            dispatch(addWishlistItem({ userId: user._id, product }));
            toast.success("Added to wishlist");
        }
    }, [user, wishlistItems, searchedData, dispatch]);

    const isPrevPage = page > 1;
    const isNextPage = searchedData ? page < searchedData.totalPage : false;

    if (isCategoryError) {
        const err = categoryError as CustomError;
        toast.error(err.data.message);
    }
    if (isProductError) {
        const err = productError as CustomError;
        toast.error(err.data.message);
    }

    return (
        <div className="product-search-page">
            <PageTitle title="Search Products" />
            <aside>
                <h2>Filters</h2>
                <div>
                    <h4>Sort</h4>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">None</option>
                        <option value="asc">Price (Low to High)</option>
                        <option value="dsc">Price (High to Low)</option>
                    </select>
                </div>
                <div>
                    <h4>Max Price: {maxPrice || ""}</h4>
                    <input
                        type="range"
                        min={100}
                        max={900000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                </div>
                <div>
                    <h2>Category</h2>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">ALL</option>
                        {!isCategoryLoading &&
                            categoriesResponse?.categories.map((i) => (
                                <option key={i} value={i}>
                                    {i.toUpperCase()}
                                </option>
                            ))}
                    </select>
                </div>
            </aside>

            <main>
                <h1>Products</h1>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
                <div className="search-product-list">
                    {productLoading ? (
                        <p>Loading...</p>
                    ) : searchedData?.products.length === 0 ? (
                        <div className="empty-state">
                            <p>No products found. Try different filters.</p>
                        </div>
                    ) : (
                        searchedData?.products.map((product) => (
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
                </div>

                {searchedData && searchedData.totalPage >= 1 && (
                    <article>
                        <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev - 1)}>
                            Prev
                        </button>
                        <span>
                            {page} of {searchedData.totalPage}
                        </span>
                        <button disabled={!isNextPage} onClick={() => setPage((prev) => prev + 1)}>
                            Next
                        </button>
                    </article>
                )}
            </main>
        </div>
    );
};

export default Search;
