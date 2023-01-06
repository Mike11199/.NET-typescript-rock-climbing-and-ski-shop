import ProductDetailsPageComponent from "./components/ProductDetailsPageComponent";


import { useDispatch } from "react-redux";


import { addToCart } from "../redux/actions/cartActions";

const ProductDetailsPage = () => {

    const dispatch = useDispatch()


  return <ProductDetailsPageComponent  addToCartReduxAction={addToCart} reduxDispatch={dispatch} />;
};

export default ProductDetailsPage;

