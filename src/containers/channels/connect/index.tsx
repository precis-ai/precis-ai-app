import { twitterGetAuthLink } from "api";
import Button from "components/Button";
import Loader from "components/Loader";
import { ChannelType, Channels } from "utils/constants";
import { useMergeState } from "utils/custom-hooks";

export default function ChannelsConnectContainer() {
  const [state] = useMergeState({
    isLoading: false,
  });

  const handleConnectChannel = async (channel: string) => {
    if (channel === ChannelType.Twitter) {
      const authLinkResponse = await twitterGetAuthLink();
      console.log("authLinkResponse : ", authLinkResponse);

      if (authLinkResponse.success) {
        window.location.href = authLinkResponse?.data?.url;
        return;
      }
    }

    if (channel === ChannelType.LinkedIn) {
      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${
        process.env.REACT_APP_LINKEDIN_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        process.env.REACT_APP_LINKEDIN_CALLBACK_URI || ""
      )}&state=precis_ai_state&scope=openid%20profile%20w_member_social`;
    }
  };

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

                  {[ChannelType.Facebook, ChannelType.Instagram].includes(
                    channel?.title
                  ) ? (
                    <div className="border border-grey px-5 py-2 rounded-[4px] text-sm">
                      Default
                    </div>
                  ) : (
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
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
