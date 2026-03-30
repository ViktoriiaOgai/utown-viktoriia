export default function PromoCards() {
  const promos = [
    { img: "/promo.jpg" },
    { img: "/promo.jpg" },
    { img: "/promo.jpg" },
    { img: "/promo.jpg" },
  ];

  return (
    <div className="promo-cards-wrapper">
      <div className="promo-cards-container">
        {promos.map((p, i) => (
          <div className="promo-card" key={i}>
            <img src="src\assets\images\promo.jpg" alt={`Promo ${i + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
