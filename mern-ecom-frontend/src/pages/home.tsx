import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { SkeletonLoader } from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import HomeCarousal from "../components/home-carousal";


const Home = () => {

  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addToCardHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart!");
  }

  if (isError) toast.error("Cannot Fetch the Products");

  return (
    <div className="home">
      <HomeCarousal/>
      
      <h1>
        Latest Products
        <Link to={'/search'} className="findmore">More</Link>
      </h1>

      <main>
        { isLoading ? <SkeletonLoader width="80vw"/> :
          data?.products.map( (product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              handler={addToCardHandler}
              photo={product.photo}
            />
          ))
        }
      </main>

    </div>
  )
}

export default Home;
