import { useMemo } from "react";
import Pagination from "react-bootstrap/Pagination";
import Loader from "./Loader";

const ListPagination = ({
  currentPage,
  totalPages,
  handlePageClick,
  loading,
}) => {
  const { pages, leftEllipsis, rightEllipsis } = useMemo(() => {
    const pagesToShow = 5;
    const pages = [];
    let leftEllipsis = false;
    let rightEllipsis = false;

    if (totalPages <= pagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= pagesToShow - 1) {
        for (let i = 1; i <= pagesToShow; i++) {
          pages.push(i);
        }
        rightEllipsis = true;
      } else if (currentPage >= totalPages - pagesToShow + 2) {
        leftEllipsis = true;
        for (let i = totalPages - pagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        leftEllipsis = true;
        rightEllipsis = true;
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return { pages, leftEllipsis, rightEllipsis };
  }, [totalPages, currentPage]);

  return (
    <div
      className="w-100 d-sm-flex justify-content-sm-center align-items-sm-center position-relative mb-3"
      style={{ height: "60px" }}
    >
      {loading && <Loader height="100%" width="100%" />}
      <Pagination style={{ marginBottom: 0 }}>
        <Pagination.First
          onClick={() => {
            if (currentPage === 1) return;
            handlePageClick(1);
          }}
        />
        <Pagination.Prev
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {leftEllipsis && <Pagination.Ellipsis />}
        {pages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        {rightEllipsis && <Pagination.Ellipsis />}
        <Pagination.Next
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => {
            if (currentPage === totalPages) return;
            handlePageClick(totalPages);
          }}
        />
      </Pagination>
    </div>
  );
};

export default ListPagination;
