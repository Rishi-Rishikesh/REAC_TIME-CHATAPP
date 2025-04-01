
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5002";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null, // Initialize socket as null
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
   
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.error("Error in logout:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      if (res.data) {
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
      } else {
        toast.error("Update failed: No data returned");
      }
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      autoConnect: true,
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null }); // Clear socket state
    }
  },
}));









// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios.js";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// // const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/";
// const BASE_URL = "http://localhost:5002"
// export const useAuthStore = create((set,get) => ({
//     authUser: null,
//     isSigningUp: false,
//     isLoggingIn: false,
//     isUpdatingProfile: false,
//     isCheckingAuth :true, // Example declaration
//     onlineUsers: [],
  
//     checkAuth: async () => {
//       try {
//         const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });
//       }  
//       catch (error) {
//         console.log("Error in checkAuth:", error);
//         set({ authUser: null });
//       } 
//       finally {
//         set({ isCheckingAuth: false });
//       }
//     },

//     signup: async (data) => {
//       set({ isSigningUp: true });
//       try {
   
//         const res = await axiosInstance.post("/auth/signup",data);
//         set({ authUser: res.data });
//         toast.success("Account created successfully");
//         get().connectSocket();
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Signup failed");
//       } finally {
//         set({ isSigningUp: false });
//       }
//     },
  

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });
//       toast.success("Logged in successfully");

//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "login failed");
//         } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//       set({ authUser: null });
//       toast.success("Logged out successfully");
//       get().disconnectSocket(); 
//     } catch (error) {
//       console.error("Error in logout:", error);
//       toast.error(error.response?.data?.message || "Logout failed");
//     }
//   },

//   updateProfile: async (data) => {
//     set({ isUpdatingProfile: true });
//     try {
//       const res = await axiosInstance.put("/auth/update-profile", data);
//       if (res.data) {
//         set({ authUser: res.data });
//         toast.success("Profile updated successfully");
//       } else {
//         toast.error("Update failed: No data returned");
//       }
//     } catch (error) {
//       console.log("error in update profile:", error);
//       toast.error(error.response?.data?.message || "Profile update failed");
//     } finally {
//       set({ isUpdatingProfile: false });
//     }
//   },

//   connectSocket: () => {
//     const { authUser } = get();
//     if (!authUser || get().socket?.connected) return;
//     console.log("connecting to the socket server...");
//     const socket = io(BASE_URL, {
//       // query: {
//       //   userId: authUser._id,
//       // },
//     });
//     socket.connect();
//     console.log ("the server was succesfully connected");

//     set({ socket: socket });

//     socket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });
//   },
//   disconnectSocket: () => {
//     if (get().socket?.connected) get().socket.disconnect();
//   },

// }));