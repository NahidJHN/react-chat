import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import baseUrl from "../utils/baseURL";

function useAuthUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getToken = localStorage.getItem("chat-app-token");
    if (getToken) {
      const decodeToken: any = jwtDecode(getToken);

      const fetchUser = async () => {
        try {
          const { data } = await baseUrl.get(`users/${decodeToken._id}`);
          setUser(data.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchUser();
    }
  }, []);

  return user;
}

export default useAuthUser;
