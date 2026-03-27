import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      // We go through the gateway (Port 3000)
      const { data } = await axios.get(
        "http://localhost:3000/api/auth/profile",
      );
      return data;
    },
  });
};
