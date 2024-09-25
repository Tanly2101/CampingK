import React, { useEffect, useState } from "react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, IconButton } from "@material-tailwind/react";
import { usePagination } from "../Context/PaginationContext";

const Pagination = () => {
  const [active, setActive] = useState(1);
  const [buttons, setButtons] = useState([]);

  const { setPage, updateTotalItems, totalItems } = usePagination();

  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => {
      setActive(index);
      setPage(index);
    },
  });

  useEffect(() => {
    const totalPages = Math.ceil(totalItems / 4);
    const buttonArray = Array.from({ length: totalPages }, (_, index) => (
      <IconButton key={index + 1} {...getItemProps(index + 1)}>
        {index + 1}
      </IconButton>
    ));
    setButtons(buttonArray);
  }, [totalItems, active]);

  const next = () => {
    if (active < buttons.length) {
      setPage(active + 1);
      setActive(active + 1);
    }
  };

  const prev = () => {
    if (active > 1) {
      setPage(active - 1);
      setActive(active - 1);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 justify-center pt-[15px] flex-none h-[55px]">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={prev}
          disabled={active === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">{buttons}</div>

        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={next}
          disabled={active === buttons.length}
        >
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
