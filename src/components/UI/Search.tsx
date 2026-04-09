import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "@/components/UI/Search.css";

type Props = {
  value?: string;
  placeholder?: string;
  error?: string;
  icon?: string;
  iconRight?: string;
  style?: React.CSSProperties;
  isSearchPage?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Search({
  value,
  placeholder,
  error,
  icon,
  iconRight,
  style,
  isSearchPage = false,
  onChange,
}: Props) {
  const navigate = useNavigate();
  const [filterActive, setFilterActive] = useState(false);
  const location = useLocation();
  const handleInputClick = () => {
    navigate("/search"); // переход на страницу поиска
  };

  const handleFilterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // чтобы клик на кнопку не открыл input
    navigate("/filters");
  };
  const isFiltersPage = location.pathname === "/filters";

  return (
    <div className="search-group">
      <div className="search-wrapper">
        {icon && <img src={icon} alt="icon" className="search-icon left" />}

        <input
          value={value}
          placeholder={placeholder}
          onClick={() => {
            if (!isSearchPage) navigate("/search");
          }}
          onChange={onChange}
          readOnly={!isSearchPage}
          className="search"
        />

        <button
          className={`filter ${isFiltersPage ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            navigate("/filters");
          }}
        >
          {iconRight && <img src={iconRight} alt="filter" className="search-icon right" />}
        </button>
      </div>

      {error && <div className="search-error">{error}</div>}
    </div>
  );
}
