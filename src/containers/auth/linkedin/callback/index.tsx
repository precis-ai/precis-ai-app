import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { linkedInAuthCallback } from "api";

export default function AuthLinkedInCallbackContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const linkedinCode = searchParams.get("code") || "";

  const linkedinState = searchParams.get("state") || "";

  const [state, setState] = useMergeState({ isLoading: false, error: false });

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await linkedInAuthCallback({
        code: linkedinCode,
        state: linkedinState,
      });

      if (response?.success) {
        navigate("/channels");
      }
    } catch (error: any) {
      setState({ error: true });
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  React.useEffect(() => {
    if (!linkedinCode || !linkedinState) {
      setState({ error: true });

      setTimeout(() => {
        navigate("/channels");
      }, 3000);

      return;
    }

    init();
  }, []);

  return (
    <div>
      {state?.isLoading && (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Loader loading={state?.isLoading} />
        </div>
      )}

      {state?.error && (
        <div className="mt-20 w-full h-screen flex justify-center">
          <div className="text-center">
            <div className="text-2xl font-semibold">
              Oops! Something went wrong!
            </div>
            <div className="mt-4">You will be redirect in a few seconds!</div>
          </div>
        </div>
      )}
    </div>
  );
}
