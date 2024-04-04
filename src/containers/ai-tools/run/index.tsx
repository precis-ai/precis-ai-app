import React from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "react-router-dom";
import TextField from "components/TextField";
import Button from "components/Button";
import ErrorMessage from "components/ErrorMessage";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import {
  getAIToolDetails,
  getAIToolsUsageHistoryDetails,
  runAITool,
} from "api";

export default function AIToolsRunContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id") || "";

  const isHistory = searchParams.get("isHistory") || false;

  const [state, setState] = useMergeState({
    isLoading: false,
    aiToolId: "",
    name: "",
    description: "",
    content: "",
    result: "",
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

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (!state.content) {
      payload = { content: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleRun = async () => {
    try {
      if (!isFormValid()) {
        return;
      }

      setState({ isRunning: true });

      const response = await runAITool({
        id: state?.aiToolId,
        content: state?.content,
      });

      if (response?.success) {
        setState({ result: response?.data });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isRunning: false });
    }
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      if (isHistory) {
        const response = await getAIToolsUsageHistoryDetails({ id });

        if (response?.success) {
          setState({
            aiToolId: response?.data?.aiTool?._id,
            name: response?.data?.aiTool?.name,
            description: response?.data?.aiTool?.description,
            content: response?.data?.content,
            result: response?.data?.result,
          });
        }
      } else {
        const response = await getAIToolDetails({ id });

        if (response?.success) {
          setState({
            aiToolId: response?.data?._id,
            name: response?.data?.name,
            description: response?.data?.description,
          });
        }
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  React.useEffect(() => {
    if (!id) {
      return;
    }

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
          <div className="text-4xl font-semibold text-grey">{state?.name}</div>

          <div className="text-lg text-grey mt-4">{state?.description}</div>

          <div className="w-full lg:w-3/5 my-8">
            <div>
              <TextField
                fullWidth
                label="CONTENT"
                variant="outlined"
                name="content"
                value={state?.content}
                onChange={handleChange}
                required
                error={state?.errors?.content}
                multiline
                minRows={4}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
              />

              {state?.errors?.content && (
                <ErrorMessage message="Please add some content" />
              )}
            </div>

            {state?.result && (
              <div className="my-8">
                <div className="font-medium">Result</div>

                <div className="border rounded-md border-solid border-[#f1f1f1] whitespace-pre-line p-4 mt-4">
                  {state?.result}
                </div>
              </div>
            )}

            <div className="mt-12">
              <Button
                label="Run"
                color="secondary"
                onClick={handleRun}
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
                loading={state?.isRunning}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
