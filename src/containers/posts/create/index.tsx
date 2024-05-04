import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { FacebookShareButton, FacebookIcon } from "react-share";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import AudioFileOutlinedIcon from "@mui/icons-material/AudioFileOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import TextField from "components/TextField";
import Button from "components/Button";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import PostDialog from "components/PostDialog";
import { useMergeState } from "utils/custom-hooks";
import {
  createPost,
  generateImage,
  generateTranscription,
  getChannels,
  schedulePost,
  sendPost,
  sendPostWithMedia,
  summarize,
} from "api";
import { ChannelType, Channels, ModelType } from "utils/constants";
import { toBase64 } from "utils/common";

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

    description: "",
    summary: "",
    content: "",

    channels: [],
    selectedChannels: [],

    selectedModel: {
      twitter: "",
      linkedIn: "",
      reddit: "",
    },

    imageDescription: "",
    imageUrl: "",
    // "https://oaidalleapiprodscus.blob.core.windows.net/private/org-nwb17Kkic4P1q9FcCgsyraU6/user-innK9wwN2zuMBTBPD1euzgPO/img-C6jhicNjbim1u7mMRf48XJUF.png?st=2024-05-02T17%3A53%3A15Z&se=2024-05-02T19%3A53%3A15Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-05-01T23%3A28%3A01Z&ske=2024-05-02T23%3A28%3A01Z&sks=b&skv=2021-08-06&sig=nWRVRUyHvdcgQT/wMfBU4fJZGuc1i6I7nJeFx0Axjw0%3D",
    imageFile: "",
    imagePreview: "",

    twitter: {
      openai: "",
      anthropic: "",
      custom: [],
    },
    linkedIn: {
      openai: "",
      anthropic: "",
      custom: [],
    },
    reddit: {
      openai: "",
      anthropic: "",
      custom: [],
    },

    twitterPost: "",
    linkedInPost: "",
    redditPost: "",

    isTranscribingDescription: false,
    isGeneratingSummary: false,
    isCreatingPost: false,
    isGeneratingImage: false,
    isSendingPost: false,

    shouldShowPost: false,

    shouldShowPostDialog: false,

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

  const handleSelectModel = (channelType: string, selectedModel: string) => {
    let payload = {};

    if (channelType === ChannelType.Twitter) {
      payload = {
        twitterPost: state?.twitter[selectedModel],
        selectedModel: {
          ...state?.selectedModel,
          twitter: selectedModel,
        },
      };
    }

    if (channelType === ChannelType.LinkedIn) {
      payload = {
        linkedInPost: state?.linkedIn[selectedModel],
        selectedModel: {
          ...state?.selectedModel,
          linkedIn: selectedModel,
        },
      };
    }

    if (channelType === ChannelType.Reddit) {
      payload = {
        redditPost: state?.reddit[selectedModel],
        selectedModel: {
          ...state?.selectedModel,
          reddit: selectedModel,
        },
      };
    }

    setState({ ...payload });
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
          twitter: response?.data?.twitter,
          linkedIn: response?.data?.linkedIn,
          reddit: response?.data?.reddit,
          twitterPost: response?.data?.twitter?.openai,
          linkedInPost: response?.data?.linkedIn?.openai,
          redditPost: response?.data?.reddit?.openai,
        });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isCreatingPost: false, shouldShowPost: true });
    }
  };

  const handleOpenPostDialog = () => {
    setState({ shouldShowPostDialog: true });
  };

  const handleClosePostDialog = () => {
    setState({ shouldShowPostDialog: false });
  };

  const handleSendPost = async (timestamp?: any) => {
    try {
      handleClosePostDialog();

      setState({ isSendingPost: true });

      const channels: Array<any> = [];

      state?.selectedChannels?.forEach((channel: any) => {
        let content = "";
        let parsedTitle = ""; // only for reddit

        if (channel.platform === ChannelType.Twitter) {
          content = state?.twitterPost;
        }

        if (channel.platform === ChannelType.LinkedIn) {
          content = state?.linkedInPost;
        }

        if (channel.platform === ChannelType.Reddit) {
          const [title, parsedPost] = state.redditPost.split("Post:");

          [, parsedTitle] = title.split("Title: ");

          content = parsedPost;
        }

        channels.push({
          id: channel.id,
          content,
          platform: channel.platform,
          title: parsedTitle,
        });
      });

      let response = null;

      if (timestamp) {
        response = await schedulePost({ channels, timestamp });
      } else if (state?.imageFile) {
        const formData = new FormData();
        formData.append("file", state.imageFile);
        formData.append("channels", JSON.stringify(channels));
        response = await sendPostWithMedia(formData);
      } else {
        response = await sendPost({ channels });
      }

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

  const transcribeDescriptionFileRef = React.useRef<any>();

  const handletranscribeDescriptionFileRef = () => {
    transcribeDescriptionFileRef.current.click();
  };

  const handleTranscribeDescription = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files && event.target.files[0];

      if (!file) {
        return;
      }

      event.target.value = "";

      setState({ isTranscribingDescription: true });

      const formData = new FormData();
      formData.append("file", file);

      const response = await generateTranscription(formData);

      if (response?.success) {
        setState({ description: response?.data?.transcription });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isTranscribingDescription: false });
    }
  };

  const imageFileRef = React.useRef<any>();

  const handleImageFileRef = () => {
    imageFileRef.current.click();
  };

  const handleChangeImageFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      return;
    }

    event.target.value = "";

    const imagePreview = await toBase64(file);

    setState({ imageFile: file, imagePreview });
  };

  const handleGenerateImage = async () => {
    try {
      setState({ isGeneratingImage: true });

      const response = await generateImage({
        content: state?.imageDescription,
      });

      if (response?.success) {
        setState({ imagePreview: response?.data?.image });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isGeneratingImage: false });
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

  const getImage = () => {
    if (state?.imageUrl) {
      return state.imageUrl;
    }

    if (state?.imagePreview) {
      return state.imagePreview;
    }

    return "";
  };

  const image = getImage();

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

            <div className="flex justify-between items-center mt-8">
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

              <span className="font-medium">OR</span>

              <Button
                label="Transcribe description from audio file"
                color="info"
                onClick={handletranscribeDescriptionFileRef}
                style={{
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  height: 40,
                }}
                fullWidth
                loaderButton
                loadingPosition="center"
                loading={state?.isTranscribingDescription}
                startIcon={<AudioFileOutlinedIcon />}
              />

              <input
                type="file"
                className="hidden"
                ref={transcribeDescriptionFileRef}
                onChange={handleTranscribeDescription}
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
                        <div>
                          {/* <div className="mt-4">
                            <div className="text-sm font-medium">
                              <Radio
                                checked={
                                  state?.selectedModel?.twitter ===
                                  ModelType.OpenAI
                                }
                                onChange={() =>
                                  handleSelectModel(
                                    ChannelType.Twitter,
                                    ModelType.OpenAI
                                  )
                                }
                                value={ModelType.OpenAI}
                              />{" "}
                              gpt-3.5-turbo
                            </div> */}

                          <div className="mt-2">
                            <textarea
                              value={state?.twitter?.openai}
                              className="w-full p-2 rounded-md"
                              rows={10}
                              disabled
                            />
                          </div>
                          {/* </div> */}

                          {/* <hr className="my-8" />

                          <div className="mt-4">
                            <div className="text-sm font-medium">
                              <Radio
                                checked={
                                  state?.selectedModel?.twitter ===
                                  ModelType.Anthropic
                                }
                                onChange={() =>
                                  handleSelectModel(
                                    ChannelType.Twitter,
                                    ModelType.Anthropic
                                  )
                                }
                                value={ModelType.Anthropic}
                              />{" "}
                              claude-3-haiku
                            </div>

                            <div className="mt-2">
                              <textarea
                                value={state?.twitter?.anthropic}
                                className="w-full p-2 rounded-md"
                                rows={10}
                                disabled
                              />
                            </div>
                          </div>

                          <hr className="my-8" />

                          <div className="mt-4">
                            <div className="text-sm font-medium">
                              <Radio
                                checked={
                                  state?.selectedModel?.twitter ===
                                  ModelType.Custom
                                }
                                onChange={() =>
                                  handleSelectModel(
                                    ChannelType.Twitter,
                                    ModelType.Custom
                                  )
                                }
                                value={ModelType.Custom}
                              />{" "}
                              Custom model
                            </div>

                            {state?.twitter?.custom?.map((content: string) => (
                              <div key={content} className="mt-2">
                                <textarea
                                  value={content}
                                  className="w-full p-2 rounded-md"
                                  rows={4}
                                  disabled
                                />
                              </div>
                            ))}
                          </div> */}
                        </div>
                      )}

                      {channel?.platform === ChannelType.LinkedIn && (
                        <div>
                          {/* <div className="mt-4">
                            <div className="text-sm font-medium">
                              <Radio
                                checked={
                                  state?.selectedModel?.linkedIn ===
                                  ModelType.OpenAI
                                }
                                onChange={() =>
                                  handleSelectModel(
                                    ChannelType.LinkedIn,
                                    ModelType.OpenAI
                                  )
                                }
                                value={ModelType.OpenAI}
                              />{" "}
                              gpt-3.5-turbo
                            </div> */}

                          <div className="mt-2">
                            <textarea
                              value={state?.linkedIn?.openai}
                              className="w-full p-2 rounded-md"
                              rows={10}
                              disabled
                            />
                          </div>
                          {/* </div> */}

                          {/* <hr className="my-8" />

                          <div className="mt-4">
                            <div className="text-sm font-medium">
                              <Radio
                                checked={
                                  state?.selectedModel?.linkedIn ===
                                  ModelType.Anthropic
                                }
                                onChange={() =>
                                  handleSelectModel(
                                    ChannelType.LinkedIn,
                                    ModelType.Anthropic
                                  )
                                }
                                value={ModelType.Anthropic}
                              />{" "}
                              claude-3-haiku
                            </div>

                            <div className="mt-2">
                              <textarea
                                value={state?.linkedIn?.anthropic}
                                className="w-full p-2 rounded-md"
                                rows={10}
                                disabled
                              />
                            </div>
                          </div>

                          <hr className="my-8" />

                          <div className="mt-4">
                            <div className="text-sm font-medium">
                              <Radio
                                checked={
                                  state?.selectedModel?.linkedIn ===
                                  ModelType.Custom
                                }
                                onChange={() =>
                                  handleSelectModel(
                                    ChannelType.LinkedIn,
                                    ModelType.Custom
                                  )
                                }
                                value={ModelType.Custom}
                              />{" "}
                              Custom model
                            </div>

                            {state?.linkedIn?.custom?.map((content: string) => (
                              <div key={content} className="mt-2">
                                <textarea
                                  value={content}
                                  className="w-full p-2 rounded-md"
                                  rows={4}
                                  disabled
                                />
                              </div>
                            ))}
                          </div> */}
                        </div>
                      )}

                      {channel?.platform === ChannelType.Reddit && (
                        <div>
                          {/* <div className="mt-4">
                            <div className="text-sm font-medium">
                              <Radio
                                checked={
                                  state?.selectedModel?.reddit ===
                                  ModelType.OpenAI
                                }
                                onChange={() =>
                                  handleSelectModel(
                                    ChannelType.Reddit,
                                    ModelType.OpenAI
                                  )
                                }
                                value={ModelType.OpenAI}
                              />{" "}
                              gpt-3.5-turbo
                            </div> */}

                          <div className="mt-2">
                            <textarea
                              value={state?.reddit?.openai}
                              className="w-full p-2 rounded-md"
                              rows={10}
                              disabled
                            />
                          </div>
                          {/* </div> */}

                          {/* <hr className="my-8" />

                          <div className="mt-4">
                            <div className="text-sm font-medium">
                              <Radio
                                checked={
                                  state?.selectedModel?.reddit ===
                                  ModelType.Anthropic
                                }
                                onChange={() =>
                                  handleSelectModel(
                                    ChannelType.Reddit,
                                    ModelType.Anthropic
                                  )
                                }
                                value={ModelType.Anthropic}
                              />{" "}
                              claude-3-haiku
                            </div>

                            <div className="mt-2">
                              <textarea
                                value={state?.reddit?.anthropic}
                                className="w-full p-2 rounded-md"
                                rows={10}
                                disabled
                              />
                            </div>
                          </div>

                          <hr className="my-8" />

                          <div className="mt-4">
                            <div className="text-sm font-medium">
                              <Radio
                                checked={
                                  state?.selectedModel?.reddit ===
                                  ModelType.Custom
                                }
                                onChange={() =>
                                  handleSelectModel(
                                    ChannelType.Reddit,
                                    ModelType.Custom
                                  )
                                }
                                value={ModelType.Custom}
                              />{" "}
                              Custom model
                            </div>

                            {state?.reddit?.custom?.map((content: string) => (
                              <div key={content} className="mt-2">
                                <textarea
                                  value={content}
                                  className="w-full p-2 rounded-md"
                                  rows={4}
                                  disabled
                                />
                              </div>
                            ))}
                          </div> */}
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

              <div className="text-grey font-semibold">
                Add an image to your post (optional)
              </div>

              {/* <div className="my-4">
                <div className="text-grey font-medium text-sm">
                  Generate an image
                </div>

                <div className="my-2">
                  <TextField
                    fullWidth
                    label="IMAGE DESCRIPTION"
                    variant="outlined"
                    name="imageDescription"
                    value={state?.imageDescription}
                    onChange={handleChange}
                    multiline
                    minRows={4}
                    InputLabelProps={{
                      shrink: true,
                      disableAnimation: true,
                    }}
                    autoComplete="off"
                  />
                </div>

                <div className="my-4">
                  <Button
                    label="Generate Image"
                    color="info"
                    onClick={handleGenerateImage}
                    style={{
                      borderRadius: 4,
                      fontSize: 14,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      height: 40,
                    }}
                    fullWidth
                    loaderButton
                    loadingPosition="center"
                    loading={state?.isGeneratingImage}
                  />
                </div>
              </div> */}

              {/* <Divider>OR</Divider> */}

              <div className="my-4">
                {/* <div className="text-grey font-medium text-sm">
                  Upload your own image
                </div> */}

                <div className="my-2">
                  <Button
                    label="Upload image"
                    color="info"
                    onClick={handleImageFileRef}
                    style={{
                      borderRadius: 4,
                      fontSize: 14,
                      color: "#FFFFFF",
                      fontWeight: 500,
                      height: 40,
                    }}
                    fullWidth
                    startIcon={<CameraAltOutlinedIcon />}
                  />

                  <input
                    type="file"
                    className="hidden"
                    ref={imageFileRef}
                    onChange={handleChangeImageFile}
                  />
                </div>
              </div>

              {image && (
                <div className="bg-white border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5 my-8 w-[400px] h-[400px]">
                  <img className="rounded-md" src={image} />
                </div>
              )}
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

              {state?.shouldShowPost && (
                <div>
                  <Button
                    label="Confirm Post"
                    color="secondary"
                    onClick={handleOpenPostDialog}
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
              )}
            </div>
          </div>
        </div>
      )}

      {state?.shouldShowPostDialog && (
        <PostDialog
          open={state?.shouldShowPostDialog}
          onClose={handleClosePostDialog}
          onSubmit={handleSendPost}
        />
      )}
    </div>
  );
}
