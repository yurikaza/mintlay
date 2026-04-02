// services/projectService.ts
import axios from "axios";

export const createProject = async (
  name: string,
  walletAddress: string,
  plan: string,
) => {
  const token = localStorage.getItem("auth_token");
  console.log(name, walletAddress, plan);

  const response = await axios
    .post(
      "http://localhost:3000/api/projects/create?authorization=" + token,
      { name, wallet: walletAddress, plan },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    .then((res) => {
      console.log("Project Creation Response: ", res.data);

      return res;
    })
    .catch((err) => {
      console.error("Project Creation Failed: ", err);
      throw err;
    });
  return response.data;
};
