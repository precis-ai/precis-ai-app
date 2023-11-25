import { Outlet } from "react-router-dom";
import Nav from "components/Nav";

const shouldRenderNavBar = () => {
  if (
    window.location.pathname.includes("/signup") ||
    window.location.pathname.includes("/signin")
  ) {
    return false;
  }

  return true;
};

type Props = {
  isLoggedIn: boolean;
  user: any;
  onLogout: () => void;
};

export default function DefaultLayout({ isLoggedIn, user, onLogout }: Props) {
  return (
    <div className="lg:flex">
      {isLoggedIn && shouldRenderNavBar() && (
        <div className="w-1/4">
          <Nav isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} />
        </div>
      )}

      <div className="w-full min-h-screen sm:h-screen overflow-y-scroll overflow-x-scroll p-4 lg:px-12 lg:py-14">
        <Outlet />
      </div>
    </div>
  );
}
