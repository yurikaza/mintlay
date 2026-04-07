import axios from "axios";

export interface CreatedProject {
  id: string;
  name: string;
  plan: string;
  wallet: string;
}

export const createProject = async (
  name: string,
  walletAddress: string,
  plan: string,
): Promise<CreatedProject> => {
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

  return response.data as CreatedProject;
};
