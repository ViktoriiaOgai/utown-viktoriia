import { Outlet } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function ProfileLayout() {
  const context = useOutletContext();
  return (
    <div className="profile">
      <Outlet context={context} />
    </div>
  );
}
