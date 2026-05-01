import React from "react";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info";
}

const Badge: React.FC<Props> = ({
  children,
  variant = "info",
}) => {
  const styles = {
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    danger: "bg-red-100 text-red-600",
    info: "bg-indigo-100 text-indigo-600",
  };

  return (
    <span
      className={clsx(
        "px-2 py-1 text-xs rounded-md font-semibold shadow-sm",
        styles[variant]
      )}
    >
      {children}
    </span>
  );
};

export default Badge;