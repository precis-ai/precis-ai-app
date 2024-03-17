import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Button from "components/Button";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { disconnectChannel, getChannels } from "api";

export default function ChannelsContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,
    channels: [],
    channelMenuAnchorEl: null,
  });

  const handleConnectChannel = () => {
    navigate("/channels/connect");
  };

  const handleOpenChannelMenu = (event: any) => {
    setState({ channelMenuAnchorEl: event.currentTarget });
  };

  const handleCloseChannelMenu = () => {
    setState({ channelMenuAnchorEl: null });
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await getChannels();

      if (response?.success) {
        setState({ channels: response?.data });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handleDisconnectChannel = async (channelId: string) => {
    try {
      handleCloseChannelMenu();

      const response = await disconnectChannel({ id: channelId });

      if (response?.success) {
        enqueueSnackbar(response?.message, { variant: "success" });
        init();
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };

  React.useEffect(() => {
    init();
  }, []);

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
              Your Channels
            </div>

            <div className="md:flex mt-4 md:mt-0">
              <Button
                label="Connect New Channel"
                color="secondary"
                onClick={handleConnectChannel}
                style={{
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  height: 40,
                }}
              />
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <div className="w-1/2">
              {state?.channels.map((channel: any) => (
                <div
                  key={channel?._id}
                  className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5 my-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <img
                      src={channel?.userInfo?.picture}
                      className="w-9 h-9 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="text-lg font-semibold">
                        {channel?.userInfo?.name}{" "}
                        {channel?.userInfo?.handle
                          ? `(${channel?.userInfo?.handle})`
                          : ""}
                      </div>
                      <div className="text-sm">{channel?.platform}</div>
                    </div>
                  </div>

                  <div>
                    <IconButton onClick={handleOpenChannelMenu}>
                      <MenuOutlinedIcon />
                    </IconButton>

                    <Menu
                      anchorEl={state.channelMenuAnchorEl}
                      open={Boolean(state.channelMenuAnchorEl)}
                      onClose={handleCloseChannelMenu}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "top" }}
                    >
                      <MenuItem
                        onClick={() => handleDisconnectChannel(channel?._id)}
                      >
                        Disconnect Channel
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
