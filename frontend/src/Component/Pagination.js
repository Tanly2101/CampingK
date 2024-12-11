import React, { useEffect, useState } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, IconButton } from "@material-tailwind/react";
import { usePagination } from "../Context/PaginationContext";

const Pagination = () => {
  const [buttons, setButtons] = useState([]);
  const { currentPage, setPage, totalItems, pageSize } = usePagination();

  const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    color: "gray",
    onClick: () => setPage(index),
  });

  useEffect(() => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    const buttonArray = Array.from({ length: end - start + 1 }, (_, index) => (
      <IconButton key={start + index} {...getItemProps(start + index)}>
        {start + index}
      </IconButton>
    ));
    setButtons(buttonArray);
  }, [totalItems, pageSize, currentPage]);

  const next = () => {
    if (currentPage < buttons.length) {
      setPage(currentPage + 1);
      window.scrollTo(0, 0); // Cuộn về đầu trang
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
      window.scrollTo(0, 0); // Cuộn về đầu trang
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 justify-center pt-[15px] h-[55px]">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={prev}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">{buttons}</div>

        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={next}
          disabled={currentPage === buttons.length}
        >
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
