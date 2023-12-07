import { useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Button from "components/Button";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";

const Channels = [
  {
    title: "Twitter",
    icon: TwitterIcon,
  },
  {
    title: "Facebook",
    icon: FacebookIcon,
  },
  {
    title: "Instagram",
    icon: InstagramIcon,
  },
  {
    title: "LinkedIn",
    icon: LinkedInIcon,
  },
];

export default function ChannelsConnectContainer() {
  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,
  });

  const handleConnectChannel = (channel: string) => {};

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Loader loading={state?.isLoading} />
        </div>
      ) : (
        <div>
          <div className="md:flex md:justify-between md:items-center">
            <div className="text-4xl font-semibold text-grey">
              Connect your channels
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <div className="w-1/2">
              {Channels.map((channel) => (
                <div
                  key={channel?.title}
                  className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5 my-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <channel.icon sx={{ width: 36, height: 36 }} />
                    <div className="text-lg font-semibold ml-4">
                      {channel?.title}
                    </div>
                  </div>

                  <Button
                    label="Connect"
                    color="secondary"
                    onClick={() => handleConnectChannel(channel.title)}
                    style={{
                      borderRadius: 4,
                      fontSize: 14,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      height: 40,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
