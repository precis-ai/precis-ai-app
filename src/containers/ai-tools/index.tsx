import React from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { listAITools } from "api";

export default function AIToolsContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,
    aiTools: [],
  });

  const handleSelectAITool = (aiToolId: string) => {
    navigate(`/ai-tools/run?id=${aiToolId}`);
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await listAITools();

      if (response?.success) {
        setState({ aiTools: response?.data });
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
          <div className="text-4xl font-semibold text-grey">AI Tools</div>

          <div className="grid grid-cols-3 gap-3 mt-12">
            {state?.aiTools.map((aiTool: any) => (
              <div
                key={aiTool?._id}
                className="border rounded-lg border-solid border-[#f1f1f1] shadow-md p-4 cursor-pointer"
                onClick={() => handleSelectAITool(aiTool?._id)}
              >
                <div className="font-semibold">{aiTool?.name}</div>
                <div className="text-xs mt-3">{aiTool?.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
