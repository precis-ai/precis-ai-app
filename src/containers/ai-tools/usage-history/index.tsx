import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { formatDate } from "utils/date";
import { listAIToolsUsageHistory } from "api";

export default function AIToolsUsageHistoryContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,
    usageHistory: [],
  });

  const handleSelectAIToolUsageHistory = (aiToolId: string) => {
    navigate(`/ai-tools/run?id=${aiToolId}&isHistory=true`);
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await listAIToolsUsageHistory();

      if (response?.success) {
        setState({ usageHistory: response?.data });
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
          <div className="text-4xl font-semibold text-grey">
            AI Tools Usage History
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-3 gap-3 font-medium text-sm px-2">
              <div>Name</div>
              <div>Content</div>
              <div>Date</div>
            </div>

            <hr className="my-2" />

            {state?.usageHistory.map((history: any) => (
              <div
                key={history?._id}
                className="grid grid-cols-3 gap-3 hover:bg-slate-50 px-2 py-4 rounded-md cursor-pointer"
                onClick={() => handleSelectAIToolUsageHistory(history?._id)}
              >
                <div className="">{history?.aiTool?.name}</div>
                <div className="line-clamp-2">{history?.content}</div>
                <div className="">{formatDate(history?.createdAt, "lll")}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
