import React from "react";
import Pagination from "react-bootstrap/Pagination";

const PaginationComponent = ({
  currentPage,
  totalPages,
  setPage,
  setPageSize,
  setNextPage,
  setPreviousPage,
}) => {
  const startNumber = currentPage - 5 > 0 ? currentPage - 5 : 0;
  const endNumber = currentPage + 5 < totalPages ? currentPage + 5 : totalPages;

  useEffect(() => {
    window.scrollTo(0,0);
  }, [currentPage])

  let items = [];
  if (currentPage !== 0)
    items.push(<Pagination.First onClick={() => setPage(0)} />);
  if (currentPage !== 0)
    items.push(<Pagination.Prev onClick={setPreviousPage} />);

  for (let number = startNumber; number < endNumber; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => {
          setPageSize(25);
          setPage(number);
        }}
      >
        {number + 1}
      </Pagination.Item>
    );
  }
  if (currentPage !== totalPages - 1)
    items.push(<Pagination.Next onClick={setNextPage} />);
  if (currentPage !== totalPages - 1)
    items.push(<Pagination.Last onClick={() => setPage(totalPages)} />);

  return (
    <div className="d-flex justify-content-center">
      <Pagination>{items}</Pagination>
    </div>
  );
};

export default PaginationComponent;
