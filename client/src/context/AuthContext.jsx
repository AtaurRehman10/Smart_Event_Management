import { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const token = localStorage.getItem('token');
          if (token) {
               authApi.getMe()
                    .then(res => setUser(res.data.user))
                    .catch(() => {
                         localStorage.removeItem('token');
                         localStorage.removeItem('user');
                    })
                    .finally(() => setLoading(false));
          } else {
               setLoading(false);
          }
     }, []);

     const login = async (credentials) => {
          const res = await authApi.login(credentials);
          localStorage.setItem('token', res.data.token);
          setUser(res.data.user);
          return res.data;
     };

     const register = async (data) => {
          const res = await authApi.register(data);
          localStorage.setItem('token', res.data.token);
          setUser(res.data.user);
          return res.data;
     };

     const logout = () => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
     };

     const updateProfile = async (data) => {
          const res = await authApi.updateProfile(data);
          setUser(res.data.user);
          return res.data;
     };

     return (
          <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
               {children}
          </AuthContext.Provider>
     );
}
