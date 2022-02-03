import React from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationComponentV2 = ({
  page,
  totalPages,
  setPage,
  hasNextPage,
  hasPrevPage,
  totalDocs,
  goNext,
  goPrev,
  loading,
}) => {
  const startNumber = page - 5 > 1 ? page - 5 : 1;
  const endNumber = page + 5 < totalPages ? page + 5 : totalPages;

  let items = [];
  if (hasPrevPage) items.push(<Pagination.First onClick={() => setPage(1)} />);
  if (hasPrevPage) items.push(<Pagination.Prev onClick={goPrev} />);

  for (let number = startNumber; number < endNumber; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === page}
        onClick={() => {
          setPage(number);
        }}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (hasNextPage) items.push(<Pagination.Next onClick={goNext} />);
  if (hasNextPage)
    items.push(<Pagination.Last onClick={() => setPage(totalPages)} />);

  return (
    <>
      {totalDocs > 1 && (
        <div className="d-flex justify-content-center">
          <Pagination>{items}</Pagination>
        </div>
      )}
      <div className="py-2 text-center">
        Showing {page} of {totalPages} pages with {totalDocs} items.
      </div>
    </>
  );
};

export default PaginationComponentV2;
