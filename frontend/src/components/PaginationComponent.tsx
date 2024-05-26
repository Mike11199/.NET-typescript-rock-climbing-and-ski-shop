import React from "react";
import { Pagination } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const PaginationComponent = ({ paginationLinksNumber, pageNum }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const buildPageUrl = (pageNum) => {
    const params = new URLSearchParams(location.search);
    params.set("pageNum", pageNum);
    return `${location.pathname}?${params.toString()}`;
  };

  const handlePageChange = (newPageNum) => {
    navigate(buildPageUrl(newPageNum));
  };

  return (
    <Pagination>
      <Pagination.Prev
        onClick={() => handlePageChange(pageNum - 1)}
        disabled={pageNum === 1}
      />
      {[...Array(paginationLinksNumber).keys()].map((x) => (
        <Pagination.Item
          key={x + 1}
          active={x + 1 === pageNum}
          onClick={() => handlePageChange(x + 1)}
        >
          {x + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => handlePageChange(pageNum + 1)}
        disabled={pageNum === paginationLinksNumber}
      />
    </Pagination>
  );
};

export default PaginationComponent;
