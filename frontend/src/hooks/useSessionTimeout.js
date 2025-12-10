import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-toastify";

function UseSessionTimeout() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const getSessionTimeout = () => {
      const saved = localStorage.getItem("sessionTimeout");
      if (saved) {
        try {
          return parseInt(JSON.parse(saved)) || 30;
        } catch {
          return 30;
        }
      }
      return 30;
    };

    const checkSession = () => {
      if (!authService.isAuthenticated()) {
        return;
      }

      const timeoutMinutes = getSessionTimeout();
      const timeoutMs = timeoutMinutes * 60 * 1000;
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity >= timeoutMs) {
        toast.warning("Session expired due to inactivity. Please login again.");
        authService.logoutUser();
        navigate("/login", { replace: true });
        return;
      }

      const remainingTime = timeoutMs - timeSinceLastActivity;
      timeoutRef.current = setTimeout(() => {
        checkSession();
      }, remainingTime);
    };

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    if (authService.isAuthenticated()) {
      checkSession();
    }

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [navigate]);
}

export default UseSessionTimeout;
