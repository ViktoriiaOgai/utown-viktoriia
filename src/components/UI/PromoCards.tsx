import { useState } from "react";
import "@/components/UI/PromoCards.css";

type Props = {
  variant?: "scroll" | "pagination";
};

export default function PromoCards({ variant = "scroll" }: Props) {
  const promos = [
    { img: "/promo.jpg" },
    { img: "/promo.jpg" },
    { img: "/promo.jpg" },
    { img: "/promo.jpg" },
  ];

  const [current, setCurrent] = useState(0);

  return (
    <div className="promo-cards-wrapper">
      {/* SCROLL — НЕ ТРОГАЕМ */}
      {variant === "scroll" && (
        <div className="promo-cards-container">
          {promos.map((p, i) => (
            <div className="promo-card" key={i}>
              <img src="src/assets/images/promo.jpg" alt={`Promo ${i + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION — НОВЫЕ КЛАССЫ */}
      {variant === "pagination" && (
        <>
          <div className="promo-pagination-viewport">
            <div
              className="promo-pagination-slider"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {promos.map((p, i) => (
                <div className="promo-pagination-card" key={i}>
                  <img src="src/assets/images/promo.jpg" alt={`Promo ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="dots">
            {promos.map((_, i) => (
              <span
                key={i}
                className={current === i ? "dot active" : "dot"}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
