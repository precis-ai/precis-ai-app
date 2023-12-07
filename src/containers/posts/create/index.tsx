import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextField from "components/TextField";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";
import ErrorMessage from "components/ErrorMessage";
import { createPost, sendPost, summarize } from "api";

export default function CreatePostContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,

    description: "",
    summary: "",
    content: "",

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

  const handleGenerateSummary = async () => {
    try {
      setState({ isLoading: true });

      const response = await summarize({ description: state?.description });

      if (response?.success) {
        setState({ summary: response?.data });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handleCreatePost = async () => {
    try {
      setState({ isLoading: true });

      const response = await createPost({ summary: state?.summary });

      if (response?.success) {
        setState({ content: response?.data });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handleSendPost = async () => {
    try {
      setState({ isLoading: true });

      const response = await sendPost({ content: state?.content });

      if (response?.success) {
        enqueueSnackbar(response?.message, { variant: "success" });
        navigate("/posts");
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  return (
    <div>
      <div className="md:flex md:justify-between md:items-center">
        <div className="text-4xl font-semibold text-grey">Create Post</div>
      </div>

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
          {!state?.summary && !state?.content && (
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
              loading={state?.isLoading}
            />
          )}

          {state?.summary && !state?.content && (
            <Button
              label="Generate Post"
              color="secondary"
              onClick={handleCreatePost}
              style={{
                borderRadius: 4,
                fontSize: 14,
                color: "#FFFFFF",
                fontWeight: 500,
                height: 40,
              }}
              loaderButton
              loadingPosition="center"
              loading={state?.isLoading}
            />
          )}

          {state?.content && (
            <Button
              label="Send Post"
              color="secondary"
              onClick={handleSendPost}
              style={{
                borderRadius: 4,
                fontSize: 14,
                color: "#FFFFFF",
                fontWeight: 500,
                height: 40,
              }}
              loaderButton
              loadingPosition="center"
              loading={state?.isLoading}
            />
          )}
        </div>

        {state?.summary && !state?.content && (
          <div>
            <hr className="my-8" />

            <div className="text-grey font-semibold">Summary</div>

            <p className="mt-4">{state?.summary}</p>
          </div>
        )}

        {state?.content && (
          <div>
            <hr className="my-8" />

            <div className="text-grey font-semibold">Post</div>

            <p className="mt-4">{state?.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
