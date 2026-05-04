import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRestaurant, getOperatingModes, OperatingMode } from "@/services/workingHoursService";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const restaurant = await getMyRestaurant();
        localStorage.setItem("restaurantId", String(restaurant.id));
        setRestaurantId(restaurant.id);
        const data = await getOperatingModes(restaurant.id);
        setModes(data);
      } catch {
        setError("Failed to load working hours");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getModeForDay = (dayValue: number) => modes.find((m) => m.dayOfWeek === dayValue);

  if (loading) {
    return (
      <div className="hours-screen">
        <div className="hours-loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="hours-screen">
      <div className="hours-header">
        <button className="hours-back" onClick={() => navigate("/admin-mobile/home")}>
          ←
        </button>
        <span className="hours-brand">UT.BUSINESS</span>
      </div>

      <h1 className="hours-title">Opening hours of the establishment</h1>

      {error && <div className="hours-error">{error}</div>}

      <div className="hours-list">
        {DAYS.map((day) => {
          const mode = getModeForDay(day.value);
          return (
            <div key={day.value} className="hours-row">
              <div className="hours-day-info">
                <span className="hours-day">{day.label}</span>
                {mode ? (
                  <span className="hours-day-time">
                    {mode.dayOff ? "Day off" : `${mode.start} - ${mode.end}`}
                  </span>
                ) : (
                  <span className="hours-day-time hours-day-time--empty">Not set</span>
                )}
              </div>
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
