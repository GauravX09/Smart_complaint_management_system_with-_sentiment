import React from "react";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<Props> = ({ children, className, hover = true }) => {
  return (
    <div
      className={clsx(
        "bg-white border border-gray-200 rounded-2xl shadow-soft-md p-5 transition duration-250 ease-smooth",
        hover && "shadow-soft-md hover:shadow-soft-lg hover:-translate-y-1",
        className
      )}
    >
      
      {children}
    </div>
    
  );
};

export default Card;