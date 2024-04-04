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
  workspaceId: string | null;
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

export const onboard = async (payload: {
  name: string;
  content: Array<string>;
}) => {
  try {
    const response = await API.post("/users/onboard", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const listMembers = async () => {
  try {
    const response = await API.get("/users/members", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const inviteMember = async (payload: {
  email: string;
  role: string;
}) => {
  try {
    const response = await API.post("/users/members", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// ---------- MARKETING-STRATEGY ----------

export const listMarketingStrategies = async () => {
  try {
    const response = await API.get("/marketing-strategy", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getMarketingStrategyDetails = async (params: { id: string }) => {
  try {
    const response = await API.get("/marketing-strategy/details", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const createMarketingStrategy = async (payload: {
  name: string;
  content: Array<string>;
}) => {
  try {
    const response = await API.post("/marketing-strategy", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// ---------- AUTH ----------

export const twitterGetAuthLink = async () => {
  try {
    const response = await API.get("/auth/twitter/link", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const twitterAuthCallback = async (payload: {
  oauthToken: string;
  oauthVerifier: string;
}) => {
  try {
    const response = await API.post("/auth/twitter/callback", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const linkedInAuthCallback = async (payload: {
  code: string;
  state: string;
}) => {
  try {
    const response = await API.post("/auth/linkedin/callback", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// ---------- CHANNELS ----------

export const getChannels = async () => {
  try {
    const response = await API.get("/channels", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const disconnectChannel = async (params: { id: string }) => {
  try {
    const response = await API.delete("/channels", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

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

export const sendPost = async (payload: { channels: Array<any> }) => {
  try {
    const response = await API.post("/posts/send", payload, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

// ---------- AI TOOLS ----------

export const listAITools = async () => {
  try {
    const response = await API.get("/ai-tools", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getAIToolDetails = async (params: { id: string }) => {
  try {
    const response = await API.get("/ai-tools/details", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const listAIToolsUsageHistory = async () => {
  try {
    const response = await API.get("/ai-tools/usage-history", {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const getAIToolsUsageHistoryDetails = async (params: { id: string }) => {
  try {
    const response = await API.get("/ai-tools/usage-history/details", {
      params,
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};

export const runAITool = async (paylaod: { id: string; content: string }) => {
  try {
    const response = await API.post("/ai-tools/run", paylaod, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    return processError(error);
  }
};
