import { useDispatch } from "react-redux";
import { useDisconnect } from "wagmi";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

export const useLogout = () => {
  const dispatch = useDispatch();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear Redux State
    dispatch(logout());

    // 2. Clear any lingering persistence (if using localStorage or Cookies)
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    // 3. Disconnect Wallet (Optional, but recommended for security)
    disconnect();

    // 4. Redirect to Home
    navigate("/");
  };

  return { handleLogout };
};
