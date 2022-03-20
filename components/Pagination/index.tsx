import Pagination from "react-bootstrap/Pagination";
import React from "react";

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

  const items = [];
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
    <div style={{ display: "block", width: "100%" }}>
      <div className="flex flex-col">
        {totalDocs > 1 && (
          <div className="d-flex justify-content-center">
            <Pagination>{items}</Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginationComponentV2;
