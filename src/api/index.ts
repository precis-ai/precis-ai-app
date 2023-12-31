import axios from "axios";
import { PRECIS_AI_TOKEN } from "utils/constants";

const getHeaders = () => ({
  "x-access-token": localStorage.getItem(PRECIS_AI_TOKEN) || "",
});

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 30000,
});

const Exception = (message: any) => {
  const error: any = new Error(message);

  error.success = false;

  return error;
};

const processError = (error: any) => {
  if (error?.response?.status === 401) {
    localStorage.removeItem(PRECIS_AI_TOKEN);
    window.location.href = "/";
  }

  if (error?.response?.data) {
    // client received an error response (5xx, 4xx)

    throw Exception(error.response.data?.message);
  }

  if (error?.request) {
    // client never received a response, or request never left
    throw Exception("It's not you, it's us, want to give it another try?");
  }

  // anything else
  throw Exception("Oops! Something went wrong.");
};

// ---------- USERS ----------

export const signup = async (payload: {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await API.post("/users/signup", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const signin = async (payload: { email: string; password: string }) => {
  try {
    const response = await API.post("/users/signin", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get("/users/me", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const updateProfile = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
}) => {
  try {
    const response = await API.put("/users/profile", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const updateWorkspace = async (payload: { name: string }) => {
  try {
    const response = await API.put("/users/workspace", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// ---------- CHANNELS ----------

// ---------- POSTS ----------

export const getPosts = async () => {
  try {
    const response = await API.get("/posts", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const summarize = async (payload: { description: string }) => {
  try {
    const response = await API.post("/posts/summarize", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const createPost = async (payload: { summary: string }) => {
  try {
    const response = await API.post("/posts", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const sendPost = async (payload: { content: string }) => {
  try {
    const response = await API.post("/posts/send", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};
