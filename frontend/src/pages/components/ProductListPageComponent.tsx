import { Row, Col, Container, ListGroup, Button } from "react-bootstrap";
import PaginationComponent from "../../components/PaginationComponent";
import SortOptionsComponent from "../../components/SortOptionsComponent";
import PriceFilterComponent from "../../components/filterQueryResultOptions/PriceFilterComponent";
import RatingFilterComponent from "../../components/filterQueryResultOptions/RatingFilterComponent";
import CategoryFilterComponent from "../../components/filterQueryResultOptions/CategoryFilterComponent";
import AttributesFilterComponent from "../../components/filterQueryResultOptions/AttributesFilterComponent";
import { useSelector } from "react-redux";
import { ReduxAppState } from "types";
import { Spinner } from "react-bootstrap";

import ProductForListComponent from "../../components/ProductForListComponent";

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Product, Category, GetProductsResponse, GetProducts } from "types";

interface ProductListPageComponentProps {
  getProducts: (params: GetProducts) => Promise<GetProductsResponse>;
  categories: Category[];
}

const ProductListPageComponent = ({
  getProducts,
  categories,
}: ProductListPageComponentProps) => {
  const [products, setProducts] = useState<Product[] | null | undefined>([]);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [attrsFilter, setAttrsFilter] = useState<any>([]); // collect category attributes from db and show on the webpage
  const [attrsFromFilter, setAttrsFromFilter] = useState([]); // collect user filters for category attributes
  const [showResetFiltersButton, setShowResetFiltersButton] = useState(false);

  const [filters, setFilters] = useState({}); // collect all filters
  const [priceFilter, setPriceFilter] = useState<number>(970);
  const [ratingsFromFilter, setRatingsFromFilter] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [paginationLinksNumber, setPaginationLinksNumber] = useState<any>(null);
  const [pageNum, setPageNum] = useState<number | null>(null);

  const { categoryName } = useParams() || "";
  const { pageNumParam } = useParams() || 1;
  const { searchQuery } = useParams() || "";
  const location = useLocation();
  const navigate = useNavigate();

  const { mode } = useSelector((state: ReduxAppState) => state.DarkMode);

  // TODO: replace obsolete useEffect from API v1 to set attributes filter
  // useEffect(() => {
  //   if (categoryName) {
  //     let categoryAllData = categories.find(
  //       (item) => item.name === categoryName.replaceAll(",", "/")
  //     );
  //     if (categoryAllData) {
  //       let mainCategory = categoryAllData?.name?.split("/")[0] ?? "";
  //       let index = categories?.findIndex((item) => item?.name === mainCategory);
  //       setAttrsFilter(categories[index].attrs);
  //     }
  //   } else {
  //     setAttrsFilter([]);
  //   }
  // }, [categoryName, categories]);

  // TODO: replace obsolete useEffect from API v1 to filter by categories
  // useEffect(() => {
  //   if (Object.entries(categoriesFromFilter).length > 0) {
  //     setAttrsFilter([]);
  //     var cat: any[] = [];
  //     var count;
  //     Object.entries(categoriesFromFilter).forEach(([category, checked]) => {
  //       if (checked) {
  //         var name = category.split("/")[0];
  //         cat.push(name);
  //         count = cat.filter((x) => x === name).length;
  //         if (count === 1) {
  //           var index = categories.findIndex((item) => item.name === name);
  //           // setAttrsFilter((attrs: any) => [...attrs, ...categories[index].attrs]);
  //         }
  //       }
  //     });
  //   }
  // }, [categoriesFromFilter, categories]);

  useEffect(() => {
    setLoading(true);
    getProducts({
      categoryName,
      pageNumParam,
      searchQuery,
      filters,
      sortOption,
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
  }, [categoryName, pageNumParam, searchQuery, filters, sortOption]);

  useEffect(() => {
    if (products && products?.length > 0) {
      console.log(products);
    }
  }, [products]);

  const handleFilters = () => {
    navigate(location.pathname.replace(/\/[0-9]+$/, ""));
    setShowResetFiltersButton(true);
    setFilters({
      price: priceFilter,
      rating: ratingsFromFilter,
      category: categoriesFromFilter,
      attrs: attrsFromFilter,
    });
  };

  const resetFilters = () => {
    setShowResetFiltersButton(false);
    setFilters({});
    window.location.href = "/product-list";
  };

  const listItemStyle = {
    backgroundColor: mode === "dark" ? "rgb(45, 45, 45)" : "rgb(255, 255, 255)",
    color: mode === "dark" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item className="mb-3 mt-3" style={listItemStyle}>
                <SortOptionsComponent setSortOption={setSortOption} />
              </ListGroup.Item>
              <ListGroup.Item style={listItemStyle}>
                FILTER: <br />
                <PriceFilterComponent
                  price={priceFilter}
                  setPrice={setPriceFilter}
                />
              </ListGroup.Item>
              <ListGroup.Item style={listItemStyle}>
                <RatingFilterComponent
                  setRatingsFromFilter={setRatingsFromFilter}
                />
              </ListGroup.Item>
              {!location.pathname.match(/\/category/) && (
                <ListGroup.Item style={listItemStyle}>
                  <CategoryFilterComponent
                    setCategoriesFromFilter={setCategoriesFromFilter}
                  />
                </ListGroup.Item>
              )}
              <ListGroup.Item style={listItemStyle}>
                <AttributesFilterComponent
                  attrsFilter={attrsFilter}
                  setAttrsFromFilter={setAttrsFromFilter}
                />
              </ListGroup.Item>
              <ListGroup.Item style={listItemStyle}>
                <Button type="button" variant="primary" onClick={handleFilters}>
                  Filter
                </Button>{" "}
                {showResetFiltersButton && (
                  <Button type="button" onClick={resetFilters} variant="danger">
                    Reset filters
                  </Button>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={9}>
            {!loading && products?.length !== 0 && (
              <div
                style={{
                  left: 0,
                  position: "relative",
                  alignItems: "start",
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "2rem",
                }}
              >
                <div
                  style={{
                    marginBottom: "0rem",
                  }}
                >
                  <h6>{totalProductsCount} {totalProductsCount === 1 ? 'Result' : 'Results'}</h6>
                </div>
              </div>
            )}
            {loading ? (
              <div
                style={{
                  left: 0,
                  position: "absolute",
                  alignItems: "center",
                  display: "flex",
                  width: "100vw",
                  flexDirection: "column",
                  marginTop: "2rem",
                }}
              >
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
            ) : error ? (
              <>
                <div>Error loading products.</div>
              </>
            ) : (
              <></>
            )}
            {!loading &&
              products?.map((product) => (
                <ProductForListComponent
                  key={product?.productId}
                  images={product?.images}
                  name={product?.name}
                  description={product?.description}
                  price={product?.price}
                  rating={3 + Math.random() * 2} //TODO - still WIP with api v2
                  reviewsNumber={Math.floor(Math.random() * 22)} //TODO - still WIP with api v2
                  productId={product?.productId}
                />
              ))}
            {!loading && paginationLinksNumber > 1 ? (
              <PaginationComponent
                categoryName={categoryName}
                searchQuery={searchQuery}
                paginationLinksNumber={paginationLinksNumber}
                pageNum={pageNum}
              />
            ) : null}
            {!loading && products?.length === 0 && (
              <div
                style={{
                  left: 0,
                  position: "absolute",
                  alignItems: "center",
                  display: "flex",
                  width: "100vw",
                  flexDirection: "column",
                  marginTop: "2rem",
                }}
              >
                <div
                  style={{
                    marginBottom: "1rem",
                  }}
                >
                  No products found.
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductListPageComponent;
