import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FacebookShareButton, FacebookIcon } from "react-share";
import Checkbox from "@mui/material/Checkbox";
import TextField from "components/TextField";
import Button from "components/Button";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { createPost, getChannels, sendPost, summarize } from "api";
import { ChannelType, Channels } from "utils/constants";

export default function CreatePostContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,

    // description: `Before containers were an option, developers and administrators faced challenges with compatibility restrictions. You would build applications specifically for their pre-determined environments. When a workload needed to be migrated (for example, from bare metal to a virtual machine (VM), from a VM to the cloud, or between service providers), you had to rebuild the application or the workload entirely to ensure compatibility with the new environment. Container technology was invented to overcome these incompatibilities by providing a common interface. With the release of Docker, the interest in containers technology rapidly increased.

    // Container technology uses the resource-isolation features of the Linux kernel to sandbox an application, its dependencies, configuration files, and interfaces inside an atomic unit called a container. This allows a container to run on any host with the suitable kernel components, while shielding the application from behavioral inconsistencies through variances in software installed on the host. Containers use operating system (OS) level virtualization compared to VMs, which use hardware level virtualization using hypervisor. A hypervisor is a software or a firmware that creates and runs VMs. Multiple containers can run on a single host OS without needing a hypervisor, while isolated from neighboring containers. This layer of isolation allows consistency, flexibility, and portability, which enable rapid software deployment and testing. There are many ways in which using containers on AWS can benefit your organization. Containers have been widely employed in use cases such as distributed applications, batch jobs, and continuous deployment pipelines. The use cases for containers continue to grow in areas like distributed data processing, streaming media delivery, genomics, and machine learning, including generative AI.`,
    // summary:
    //   "The advent of container technology revolutionized the way developers and administrators handle workloads. Containers provide a common interface, overcoming compatibility restrictions between environments. With Docker's release, interest in containers soared. Unlike VMs, containers use OS-level virtualization for consistency, flexibility, and portability. AWS offers various use cases for containers, from distributed applications to machine learning and generative AI. #containerization #AWS #Docker #cloudcomputing    ",
    // content:
    //   "With Docker's release, interest in containers soared. Unlike VMs, containers use OS-level virtualization for consistency, flexibility, and portability. AWS offers various use cases for containers. #containerization #AWS #Docker #cloudcomputing    With Docker's release, interest in containers soared. Unlike VMs, containers use OS-level virtualization for consistency, flexibility, and portability. AWS offers various use cases for containers. #containerization #AWS #Docker #cloudcomputing    With Docker's release, interest in containers soared. Unlike VMs, containers use OS-level virtualization for consistency, flexibility, and portability. AWS offers various use cases for containers. #containerization #AWS #Docker #cloudcomputing    With Docker's release, interest in containers soared. Unlike VMs, containers use OS-level virtualization for consistency, flexibility, and portability. AWS offers various use cases for containers. #containerization #AWS #Docker #cloudcomputing    With Docker's release, interest in containers soared. Unlike VMs, containers use OS-level virtualization for consistency, flexibility, and portability. AWS offers various use cases for containers. #containerization #AWS #Docker #cloudcomputing    ",

    channels: [],
    selectedChannels: [],

    twitterPost: "",
    linkedInPost: "",
    redditPost: "",

    isGeneratingSummary: false,
    isCreatingPost: false,
    isSendingPost: false,

    shouldShowPost: false,

    errors: {},
  });

  const handleChange = (event: any) => {
    setState({
      [event.target.name]: event.target.value,
      errors: {
        [event.target.name]: false,
      },
    });
  };

  const handleSelectChannel = (channel: any) => {
    const selectedChannels = [...state.selectedChannels];

    const index = selectedChannels?.findIndex(
      (elem: any) => elem?.id === channel?._id
    );

    if (index === -1) {
      selectedChannels.push({ id: channel?._id, platform: channel?.platform });
    } else {
      selectedChannels.splice(index, 1);
    }

    setState({ selectedChannels });
  };

  const handleGenerateSummary = async () => {
    try {
      setState({ isGeneratingSummary: true });

      const response = await summarize({ description: state?.description });

      if (response?.success) {
        setState({ summary: response?.data });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isGeneratingSummary: false });
    }
  };

  const handleCreatePost = async () => {
    try {
      setState({ isCreatingPost: true });

      const response = await createPost({ summary: state?.summary });

      if (response?.success) {
        setState({
          twitterPost: response?.data?.twitterPost,
          linkedInPost: response?.data?.linkedInPost,
        });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isCreatingPost: false, shouldShowPost: true });
    }
  };

  const handleSendPost = async () => {
    try {
      setState({ isSendingPost: true });

      const channels: Array<any> = [];

      state?.selectedChannels?.forEach((channel: any) => {
        let content = "";

        if (channel.platform === ChannelType.Twitter) {
          content = state?.twitterPost;
        }

        if (channel.platform === ChannelType.LinkedIn) {
          content = state?.linkedInPost;
        }

        channels.push({
          id: channel.id,
          content,
          platform: channel.platform,
        });
      });

      console.log("channels : ", channels);

      const response = await sendPost({ channels });

      if (response?.success) {
        enqueueSnackbar(response?.message, { variant: "success" });
        navigate("/posts");
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isSendingPost: false });
    }
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
          <div className="text-4xl font-semibold text-grey">Create Post</div>

          <div className="w-full lg:w-3/5 my-8">
            <div>
              <div className="my-2">
                <TextField
                  fullWidth
                  label="DESCRIPTION"
                  variant="outlined"
                  name="description"
                  value={state?.description}
                  onChange={handleChange}
                  required
                  error={state?.errors?.description}
                  multiline
                  minRows={4}
                  InputLabelProps={{
                    shrink: true,
                    disableAnimation: true,
                  }}
                  autoComplete="off"
                />

                {state?.errors?.description && (
                  <ErrorMessage message="Description is required" />
                )}
              </div>
            </div>

            <div className="mt-8">
              <Button
                label="Summarize"
                color="secondary"
                onClick={handleGenerateSummary}
                style={{
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  height: 40,
                }}
                loaderButton
                loadingPosition="center"
                loading={state?.isGeneratingSummary}
              />
            </div>

            {state?.summary && (
              <div>
                <hr className="my-8" />

                <div className="text-grey font-semibold">Summary</div>

                <p className="mt-4">{state?.summary}</p>
              </div>
            )}

            <div>
              <hr className="my-8" />

              <div className="text-grey font-semibold">Available channels</div>

              {state?.channels?.map((channel: any) => (
                <div
                  key={channel?._id}
                  className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5 my-4"
                >
                  <div className="flex justify-between items-center">
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
                      <Checkbox
                        checked={state?.selectedChannels?.some(
                          (elem: any) => elem.id === channel?._id
                        )}
                        onChange={() => handleSelectChannel(channel)}
                        color="secondary"
                      />
                    </div>
                  </div>

                  {state?.shouldShowPost && (
                    <div>
                      <hr className="my-4" />

                      <div className="text-grey font-semibold">Post</div>

                      {channel?.platform === ChannelType.Twitter && (
                        <div className="mt-4">
                          <textarea
                            value={state?.twitterPost}
                            className="w-full"
                            rows={10}
                          />
                        </div>
                      )}

                      {channel?.platform === ChannelType.LinkedIn && (
                        <div className="mt-4 w-full">
                          <textarea
                            value={state?.linkedInPost}
                            className="w-full"
                            rows={10}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {Channels.filter((elem) =>
                [ChannelType.Facebook].includes(elem.title)
              )?.map((channel) => (
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

                  {channel?.title === ChannelType.Facebook && (
                    <div>
                      <FacebookShareButton
                        url="https://tryprecis.ai"
                        // quote={state?.linkedInContent}
                        // hashtag="#muo"
                      >
                        <FacebookIcon size={32} round />
                        {/* Share on Facebook */}
                      </FacebookShareButton>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div>
              <hr className="my-8" />

              {state?.summary && (
                <div className="my-4">
                  <Button
                    label="Generate Post"
                    color="info"
                    onClick={handleCreatePost}
                    style={{
                      borderRadius: 4,
                      fontSize: 14,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      height: 50,
                    }}
                    fullWidth
                    loaderButton
                    loadingPosition="center"
                    loading={state?.isCreatingPost}
                  />
                </div>
              )}

              <div>
                <Button
                  label="Send Post"
                  color="secondary"
                  onClick={handleSendPost}
                  style={{
                    borderRadius: 4,
                    fontSize: 16,
                    color: "#FFFFFF",
                    fontWeight: 500,
                    height: 50,
                  }}
                  fullWidth
                  loaderButton
                  loadingPosition="center"
                  loading={state?.isSendingPost}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
