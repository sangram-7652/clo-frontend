import api from "./client";

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const saveSession = (data) => {
  const d = data?.data ?? data;
  const token = d?.token || d?.access_token || d?.accessToken;
  const user = d?.user || d?.customer || d;

  if (!token) throw new Error("No access token returned.");

  localStorage.setItem("token", token);
  if (user && typeof user === "object")
    localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};


export async function sendOTP(email) {
  try {
    const { data } = await api.post("/auth/send-otp", { email });
    return data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Could not send OTP.",
      { cause: err },
    );
  }
}


export async function verifyOTP(email, otp) {
  try {
    const { data } = await api.post("/auth/verify-otp", {
      email: email.trim(),
      otp: otp.trim(),
    });
    return data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || err?.message || "Could not verify OTP.",
      { cause: err },
    );
  }
}

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout request failed", err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
