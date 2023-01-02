import { useParams } from "react-router-dom"

const ProductDetailsPage = () => {

    const {id} = useParams()
    console.log(id)
    return <p>product details page</p>
}

export default ProductDetailsPage