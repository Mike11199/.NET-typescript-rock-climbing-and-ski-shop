import { Row, Col, Container } from "react-bootstrap";
import PaginationComponent from "../../components/PaginationComponent";
import { Spinner } from "react-bootstrap";

import ProductForListComponent from "../../components/ProductForListComponent";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Product, GetProductsResponse, GetProducts } from "types";
import ProductListPageFilterComponent from "./ProductListPageFilterComponent";

interface ProductListPageComponentProps {
  getProducts: (params: GetProducts) => Promise<GetProductsResponse>;
}

const ProductListPageComponent = ({
  getProducts,
}: ProductListPageComponentProps) => {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const [products, setProducts] = useState<Product[] | null | undefined>([]);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [paginationLinksNumber, setPaginationLinksNumber] = useState<any>(null);
  const [pageNum, setPageNum] = useState<number | null>(null);

  const query = useQuery();
  const queryParamSearchQuery = query.get("search") || "";
  const queryParamPageNum = query.get("pageNum") || "1";
  const queryParamCategoryName = query.get("category") || "All";
  const queryParamRating = query.get("rating") || "";
  const queryParamSortOption = query.get("sort") || "";
  const queryParamPriceOption = query.get("price") || "";

  useEffect(() => {
    setLoading(true);
    getProducts({
      pageNumParam: queryParamPageNum,
      searchQuery: queryParamSearchQuery,
      categoryName: queryParamCategoryName,
      sortOption: queryParamSortOption,
      priceFilter: queryParamPriceOption,
      ratingFilter: queryParamRating,
    })
      .then((products) => {
        setProducts(products?.products);
        setPaginationLinksNumber(products?.paginationLinksNumber);
        setPageNum(products?.pageNum ?? 0);
        setTotalProductsCount(products?.totalProducts ?? 0);
        setLoading(false);
        setError(false);
      })
      .catch((er) => {
        console.log(er);
        setError(true);
        setLoading(false);
      });
  }, [
    queryParamSearchQuery,
    queryParamPageNum,
    queryParamCategoryName,
    queryParamRating,
    queryParamSortOption,
    queryParamPriceOption,
  ]);

  useEffect(() => {
    if (products && products?.length > 0) {
      console.log(products);
    }
  }, [products]);

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / reviews.length;
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={3}>
            <ProductListPageFilterComponent />
          </Col>
          <Col md={9}>
            <ResultsCountContainer
              productCount={totalProductsCount}
              loading={loading}
              error={error}
            />
            {!loading &&
              products?.map((product) => {
                const productReviewScore = getAverageRating(product?.reviews);
                return (
                  <ProductForListComponent
                    key={product.productId}
                    images={product.images}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    rating={productReviewScore.toFixed(2)}
                    reviewsNumber={product.reviews?.length ?? 0}
                    productId={product.productId}
                  />
                );
              })}

            {!loading &&
              !error &&
              paginationLinksNumber > 1 &&
              products?.length !== 0 && (
                <PaginationComponent
                  paginationLinksNumber={paginationLinksNumber}
                  pageNum={pageNum}
                />
              )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductListPageComponent;

/**
 * Container the following:
 *   loading:  spinner
 *   error:  error div
 *   no products:  no products div
 *   has products: result count
 */
const ResultsCountContainer = ({
  productCount,
  loading,
  error,
}: {
  productCount: number;
  loading: boolean;
  error: boolean;
}) => {
  if (!loading && productCount !== 0) {
    return (
      <div className="results-count-container">
        <div
          style={{
            marginBottom: "0rem",
          }}
        >
          <h6>
            {productCount} {productCount === 1 ? "Result" : "Results"}
          </h6>
        </div>
      </div>
    );
  } else if (loading && !error) {
    return (
      <div className="full-width-div-product-list-page">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          Loading products...
        </div>
        <Spinner
          as="span"
          animation="border"
          variant="primary"
          role="status"
          aria-hidden="true"
        />
      </div>
    );
  } else if (error) {
    <div>Error loading products.</div>;
  } else if (!loading && productCount === 0) {
    return (
      <div className="full-width-div-product-list-page">
        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          No products found.
        </div>
      </div>
    );
  }
};
