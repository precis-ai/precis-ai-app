import { Navigate, Outlet } from "react-router-dom";

type Props = {
  isLoggedIn: boolean;
};

export default function ProtectedRoute(props: Props) {
  const { isLoggedIn } = props;

  return isLoggedIn ? <Outlet /> : <Navigate to="/signin" replace />;
}
