import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RedditIcon from "@mui/icons-material/Reddit";

export const PRECIS_AI_TOKEN = "PRECIS_AI_TOKEN";

export const UserRoles = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
};

export const ChannelType = {
  Twitter: "Twitter",
  Facebook: "Facebook",
  Instagram: "Instagram",
  LinkedIn: "LinkedIn",
  Reddit: "Reddit",
};

export const Channels = [
  {
    title: ChannelType.Twitter,
    icon: TwitterIcon,
  },
  {
    title: ChannelType.LinkedIn,
    icon: LinkedInIcon,
  },
  {
    title: ChannelType.Reddit,
    icon: RedditIcon,
  },
  {
    title: ChannelType.Facebook,
    icon: FacebookIcon,
  },
  {
    title: ChannelType.Instagram,
    icon: InstagramIcon,
  },
];

export const ModelType = {
  OpenAI: "openai",
  Anthropic: "anthropic",
  Custom: "custom",
};
