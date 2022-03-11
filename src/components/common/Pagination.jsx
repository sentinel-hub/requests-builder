import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';

const Pagination = ({ currentPage, maxPage, setPage }) => {
  if (maxPage === currentPage) {
    return null;
  }
  return (
    <div className="flex items-center h-10 mb-2">
      <ArrowLeftIcon
        onClick={() => setPage((prev) => prev - 1)}
        className="w-10 block p-2 h-full border border-primary-dark rounded-tl-md rounded-bl-md text-primary-dark bg-primary-lighter cursor-pointer hover:bg-primary-light"
      />
      <span className="border-t border-b border-primary-dark h-full w-10 text-center text-primary-dark font-bold flex items-center justify-center">
        {currentPage}
      </span>
      <ArrowRightIcon
        onClick={() => setPage((prev) => prev + 1)}
        className="w-10 block p-2 border border-primary-dark rounded-tr-md rounded-br-md text-primary-dark h-full bg-primary-lighter cursor-pointer hover:bg-primary-light"
      />
    </div>
  );
};

export default Pagination;
