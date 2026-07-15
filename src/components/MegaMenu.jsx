import { Link } from "react-router-dom";

const MegaMenu = ({ menu, onClose }) => {
  if (!menu.sections?.length) return null;

  return (
    <div className="absolute top-full left-0 w-full border-t border-gray-200 bg-white shadow-lg">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-x-16 gap-y-8 px-8 py-8">
        {menu.sections.map((section) => (
          <div key={section.id}>
            <h3 className="mb-3 text-sm font-semibold uppercase text-gray-900">
              {section.title}
            </h3>

            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/categories/${item.slug}`}
                    onClick={onClose}
                    className="text-sm text-gray-600 transition hover:text-black"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;
