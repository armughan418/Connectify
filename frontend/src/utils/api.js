const api = () => {
  const local = "http://localhost:5000";
  const list = {
    registerUser: `${local}/user/register`,
    loginUser: `${local}/user/login`,
    forgetPassword: `${local}/user/forget/password`,
    verifyOtp: `${local}/user/otp/verify`,
    updatePassword: `${local}/user/update/password`,
    getAcess: `${local}/user/get/access`,
  };
  return list;
};
export default api;
