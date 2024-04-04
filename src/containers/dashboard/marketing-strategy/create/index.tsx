import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { createMarketingStrategy, getMarketingStrategyDetails } from "api";
import Button from "components/Button";

type Props = {
  user: any;
};

export default function DashboardMarketingStrategyCreateContainer({
  user,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id") || "";

  const [state, setState] = useMergeState({
    isLoading: false,
    name: "My Marketing Strategy",
    content: ["", "", "", "", ""],
    strategy: [],
    isSaving: false,
    errors: {},
  });

  const handleChangeContent = (value: any, place: number) => {
    const updatedContent = [...state.content];

    updatedContent[place] = value;

    setState({ content: updatedContent });
  };

  const readContent = (place: number) => state.content[place];

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await getMarketingStrategyDetails({ id });

      if (response?.success) {
        setState({
          name: response?.data?.name,
          content: response?.data?.content,
          strategy: response?.data?.strategy,
        });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handleSave = async () => {
    try {
      setState({ isSaving: true });

      const response = await createMarketingStrategy({
        name: String(state?.name).trim(),
        content: state?.content?.map((elem: string) => String(elem).trim()),
      });

      if (response?.success) {
        navigate("/dashboard/marketing-strategy");
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isSaving: false });
    }
  };

  React.useEffect(() => {
    if (!id) {
      return;
    }

    init();
  }, []);

  const isDisabled = !!id;

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Loader loading={state?.isLoading} />
        </div>
      ) : (
        <div>
          <div className="text-4xl font-semibold text-grey">
            Marketing Strategy
          </div>

          <div className="flex justify-center">
            <div className="w-11/12">
              <div className="mt-12">
                <div className="text-center text-grey text-xl">
                  Let&apos;s draft a marketing strategy for your business
                </div>

                <div className="text-center text-grey text-sm mt-5">
                  Just give us some information and we&apos;ll take care of the
                  rest
                </div>

                <div className="flex justify-center">
                  <div className="mt-10 border-[1px] rounded-lg border-solid border-[#f1f1f1] shadow-md p-5 w-fit">
                    <div>
                      <span className="font-semibold">
                        {user?.workspace?.name}
                      </span>
                      <span> helps</span>{" "}
                      <input
                        className="border border-[#f1f1f1] rounded-md px-2"
                        value={readContent(0)}
                        onChange={(event: any) =>
                          handleChangeContent(event?.target?.value, 0)
                        }
                        disabled={isDisabled}
                      />
                      <span className="mx-2">in</span>
                      <input
                        className="border border-[#f1f1f1] rounded-md px-2"
                        value={readContent(1)}
                        onChange={(event: any) =>
                          handleChangeContent(event?.target?.value, 1)
                        }
                        disabled={isDisabled}
                      />
                      <span className="mx-2">to</span>
                      <input
                        className="border border-[#f1f1f1] rounded-md mt-4 px-2"
                        value={readContent(2)}
                        onChange={(event: any) =>
                          handleChangeContent(event?.target?.value, 2)
                        }
                        disabled={isDisabled}
                      />
                      <span className="mx-2">by</span>
                      <input
                        className="border border-[#f1f1f1] rounded-md mt-4 px-2"
                        value={readContent(3)}
                        onChange={(event: any) =>
                          handleChangeContent(event?.target?.value, 3)
                        }
                        disabled={isDisabled}
                      />
                      <span className="mx-2">.</span>
                    </div>

                    <div className="mt-10">
                      <span>With this campaign, we wish to </span>
                      <input
                        className="border border-[#f1f1f1] rounded-md px-2"
                        value={readContent(4)}
                        onChange={(event: any) =>
                          handleChangeContent(event?.target?.value, 4)
                        }
                        disabled={isDisabled}
                      />
                      <span className="mx-2">.</span>
                    </div>
                  </div>
                </div>

                {!isDisabled && (
                  <div className="mt-10 flex justify-center">
                    <Button
                      label="Create"
                      color="secondary"
                      onClick={handleSave}
                      style={{
                        borderRadius: 4,
                        fontSize: 16,
                        color: "#FFFFFF",
                        fontWeight: 500,
                        height: 40,
                      }}
                      loaderButton
                      loadingPosition="center"
                      loading={state?.isSaving}
                    />
                  </div>
                )}

                {isDisabled && (
                  <div className="mt-10">
                    <div className="font-semibold">Strategy</div>

                    <div className="border rounded-md border-solid border-[#f1f1f1] whitespace-pre-line p-4 mt-4">
                      {state?.strategy[0]?.text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
