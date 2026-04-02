import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token"); // Get your JWT
      console.log("use profile token: ", token);

      const { data } = await axios
        .get(`http://localhost:3000/api/auth/profile?authorization=${token}`)
        .then((res) => {
          console.log("Profile Data: ", res.data);
          return res;
        })
        .catch((err) => {
          console.error("Failed to fetch profile: ", err);
          throw err;
        });
      return data;
    },
  });
};
