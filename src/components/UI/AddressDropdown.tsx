import { useState } from "react";
import Location from "@/assets/icons/Location.svg";
import "@/components/UI/AddressDropdown.css";

type Address = {
  id: number;
  fullAddress: string;
};

type Props = {
  addresses: Address[];
  selectedId: number | null;
  onChange: (id: number) => void;
};

export default function AddressDropdown({ addresses, selectedId, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selected = addresses.find((a) => a.id === selectedId);

  return (
    <>
      {/* FIELD */}
      <div className="field-box clickable" onClick={() => setOpen(true)}>
        <img src={Location} />

        <div className="field-content">
          <div className="title">Delivery Location</div>
          <div className="value">{selected?.fullAddress}</div>
        </div>
      </div>

      {/* OVERLAY */}
      {open && (
        <div className="sheet-overlay" onClick={() => setOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <div className="sheet-handle" />
              <h3>Select address</h3>
            </div>

            <div className="sheet-list">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`sheet-item ${addr.id === selectedId ? "active" : ""}`}
                  onClick={() => {
                    onChange(addr.id);
                    setOpen(false);
                  }}
                >
                  {addr.fullAddress}
                </div>
              ))}
            </div>

            <button className="sheet-add">+ Add new address</button>
          </div>
        </div>
      )}
    </>
  );
}
