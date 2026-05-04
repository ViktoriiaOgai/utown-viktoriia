import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { getOperatingModes, OperatingMode } from "@/services/workingHoursService";
import "./hours.scss";

const DAYS: { label: string; value: number }[] = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

export default function HoursPage() {
  const navigate = useNavigate();
  const [modes, setModes] = useState<OperatingMode[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);

  useEffect(() => {
    api.get("/restaurant-owner/restaurants").then((res) => {
      const restaurants = res.data;
      if (restaurants.length > 0) {
        const id = restaurants[0].id;
        setRestaurantId(id);
        getOperatingModes(id).then(setModes);
      }
    });
  }, []);

  const getModeForDay = (dayValue: number) => modes.find((m) => m.dayOfWeek === dayValue);

  return (
    <div className="hours-screen">
      <div className="hours-header">
        <button className="hours-back" onClick={() => navigate("/admin-mobile/home")}>
          ←
        </button>
        <span className="hours-brand">UT.BUSINESS</span>
      </div>

      <h1 className="hours-title">Opening hours of the establishment</h1>

      <div className="hours-list">
        {DAYS.map((day) => {
          const mode = getModeForDay(day.value);
          return (
            <div key={day.value} className="hours-row">
              <span className="hours-day">{day.label}</span>
              <button
                className="hours-edit"
                onClick={() =>
                  navigate(`/admin-mobile/hours/${day.value}`, {
                    state: { mode, restaurantId, dayLabel: day.label },
                  })
                }
              >
                Edit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
