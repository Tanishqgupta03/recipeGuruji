import React from "react";

const Tooltip = ({ content, children, disabled }) => (
  <div className="relative group">
    {children}
    {!disabled && (
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100">
        {content}
      </div>
    )}
  </div>
);

export default Tooltip;
