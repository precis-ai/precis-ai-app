import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export const PRECIS_AI_TOKEN = "PRECIS_AI_TOKEN";

export const ChannelType = {
  Twitter: "Twitter",
  Facebook: "Facebook",
  Instagram: "Instagram",
  LinkedIn: "LinkedIn",
};

export const Channels = [
  {
    title: ChannelType.Twitter,
    icon: TwitterIcon,
  },
  {
    title: ChannelType.Facebook,
    icon: FacebookIcon,
  },
  {
    title: ChannelType.Instagram,
    icon: InstagramIcon,
  },
  {
    title: ChannelType.LinkedIn,
    icon: LinkedInIcon,
  },
];
