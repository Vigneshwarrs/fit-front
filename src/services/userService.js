import api from "../utils/api";
export const getUserProfile = () => {
  return api.get("/user/profile");
};
export const updateUserProfile = (data) => {
  return api.put("/user/profile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
