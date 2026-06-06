// components/Common/Breadcrumb.jsx
import { Link } from "react-router-dom";

const Breadcrumb = ({ items = [] }) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[2px] text-gray-500 sm:text-xs sm:tracking-[3px]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.path && !isLast ? (
              <Link
                to={item.path}
                className="hover:text-black transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-black font-medium" : ""}>
                {item.label}
              </span>
            )}

            {!isLast && <span>/</span>}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
