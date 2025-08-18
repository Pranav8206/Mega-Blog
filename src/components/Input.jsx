import React, { useId,  forwardRef } from "react";

const Input = forwardRef(
  ({ label, type = "text", className = "", ...props }, ref) => {
    const Id = useId();

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={Id}>
            {label}
          </label>
        )}
        <input
          type={type}
          className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-100 duration-200 border border-gray-200 w-full ${className} `}
          ref={ref}
          {...props}
          id={Id}
        />
      </div>
    );
  }
);
export default Input;
