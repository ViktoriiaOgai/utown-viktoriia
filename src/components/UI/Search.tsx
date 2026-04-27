import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "@/components/UI/Search.css";

type Props = {
  value?: string;
  placeholder?: string;
  error?: string;
  icon?: string;
  iconRight?: string;
  isSearchPage?: boolean;
  disableNavigation?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Search({
  value,
  placeholder,
  error,
  icon,
  iconRight,
  isSearchPage = false,
  disableNavigation = false,
  onChange,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  // ЧИТАЕМ ПРЯМО ИЗ URL
  const params = new URLSearchParams(location.search);

  const category = params.get("category");
  const sort = params.get("sort");

  const isActive = (category && category !== "") || (sort && sort !== "recommended");

  return (
    <div className="search-group">
      <div className="search-wrapper">
        {icon && <img src={icon} alt="icon" className="search-icon left" />}

        <input
          value={value}
          placeholder={placeholder}
          onClick={() => {
            if (!isSearchPage && !disableNavigation) {
              navigate("/search");
            }
          }}
          onChange={onChange}
          className="search"
        />

        <button
          className={`filter ${isActive ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/filters${location.search}`); // ПЕРЕДАЕМ параметры
          }}
        >
          {iconRight && <img src={iconRight} alt="filter" className="search-icon right" />}
        </button>
      </div>

      {error && <div className="search-error">{error}</div>}
    </div>
  );
}
