import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createOperatingMode, updateOperatingMode } from "@/services/workingHoursService";
import "./hours.scss";

export default function HourEditPage() {
  const navigate = useNavigate();
  const { day } = useParams<{ day: string }>();
  const { state } = useLocation();
  const { mode, restaurantId, dayLabel } = state || {};

  const [start, setStart] = useState(mode?.start ?? "09:00");
  const [end, setEnd] = useState(mode?.end ?? "18:30");
  const [dayOff, setDayOff] = useState(mode?.dayOff ?? false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!restaurantId || !day) return;
    setSaving(true);
    try {
      const data = { dayOfWeek: Number(day), start, end, dayOff };
      if (mode?.id) {
        await updateOperatingMode(restaurantId, mode.id, data);
      } else {
        await createOperatingMode(restaurantId, data);
      }
      navigate("/admin-mobile/hours");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="hours-screen">
      <div className="hours-header">
        <button className="hours-back" onClick={() => navigate("/admin-mobile/hours")}>
          ←
        </button>
        <span className="hours-brand">UT.BUSINESS</span>
      </div>

      <h1 className="hours-edit-title">{dayLabel ?? `Day ${day}`}</h1>

      <div className="hours-form">
        <label className="hours-label">Start time</label>
        <input
          className="hours-input"
          type="time"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          disabled={dayOff}
        />

        <label className="hours-label">End time</label>
        <input
          className="hours-input"
          type="time"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          disabled={dayOff}
        />

        <div className="hours-dayoff-row">
          <span className="hours-label">Mark as a day off</span>
          <input
            type="checkbox"
            className="hours-toggle"
            checked={dayOff}
            onChange={() => setDayOff(!dayOff)}
          />
        </div>
      </div>

      <button className="hours-save" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
