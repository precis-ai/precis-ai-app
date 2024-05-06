import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";
import { onboard } from "api";

const OnboardingStep = {
  business_details: "business_details",
  marketing_strategy: "marketing_strategy",
};

export default function OnboardingContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useMergeState({
    isLoading: false,
    name: "",
    content: ["", "", "", "", ""],
    step: OnboardingStep.business_details,
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

  const handleChangeContent = (value: any, place: number) => {
    const updatedContent = [...state.content];

    updatedContent[place] = value;

    setState({ content: updatedContent });
  };

  const readContent = (place: number) => state.content[place];

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (!state.name) {
      payload = { name: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSubmit = async () => {
    try {
      setState({ isLoading: true });

      await onboard({
        name: String(state?.name).trim(),
        content: state?.content?.map((elem: string) => String(elem).trim()),
      });

      navigate("/dashboard");
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      setState({ isLoading: false });
    }
  };

  const handleNextStep = async () => {
    if (!isFormValid()) {
      return;
    }

    if (state?.step === OnboardingStep.business_details) {
      setState({ step: OnboardingStep.marketing_strategy });
      setSearchParams({ step: OnboardingStep.marketing_strategy });
    }

    if (state?.step === OnboardingStep.marketing_strategy) {
      await handleSubmit();
    }
  };

  React.useEffect(() => {
    setSearchParams({ step: state?.step });
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-red-light">
      <div className="bg-white opacity-90 rounded-lg w-11/12 md:w-3/5 lg:w-3/5 pt-5 pb-10 px-10 md:px-12 flex items-center my-10">
        <div className="w-full">
          {state?.step === OnboardingStep.business_details && (
            <div>
              <div className="flex justify-center text-grey text-xl">
                Let&apos;s get to know about your business
              </div>

              <div className="mt-10">
                <div>
                  <TextField
                    fullWidth
                    label="NAME"
                    variant="outlined"
                    name="name"
                    value={state?.name}
                    onChange={handleChange}
                    required
                    error={state?.errors?.name}
                    InputLabelProps={{
                      shrink: true,
                      disableAnimation: true,
                    }}
                    autoComplete="off"
                  />

                  {state?.errors?.name && (
                    <ErrorMessage message="Name is required" />
                  )}
                </div>
              </div>
            </div>
          )}

          {state?.step === OnboardingStep.marketing_strategy && (
            <div>
              <div className="text-center text-grey text-xl">
                Let&apos;s draft a marketing strategy for your business
              </div>

              <div className="text-center text-grey text-sm mt-5">
                Just give us some information and we&apos;ll take care of the
                rest
              </div>

              <div className="mt-10">
                <span className="font-semibold">{state?.name}</span>
                <span> helps</span>{" "}
                <input
                  className="border border-[#f1f1f1] rounded-md px-2"
                  style={{
                    minWidth: `${String(readContent(0)).length}ch`,
                  }}
                  value={readContent(0)}
                  onChange={(event: any) =>
                    handleChangeContent(event?.target?.value, 0)
                  }
                />
                <span className="mx-2">in</span>
                <input
                  className="border border-[#f1f1f1] rounded-md px-2"
                  value={readContent(1)}
                  style={{
                    minWidth: `${String(readContent(1)).length}ch`,
                  }}
                  onChange={(event: any) =>
                    handleChangeContent(event?.target?.value, 1)
                  }
                />
                <span className="mx-2">to</span>
                <input
                  className="border border-[#f1f1f1] rounded-md mt-4 px-2"
                  value={readContent(2)}
                  style={{
                    minWidth: `${String(readContent(2)).length}ch`,
                  }}
                  onChange={(event: any) =>
                    handleChangeContent(event?.target?.value, 2)
                  }
                />
                <span className="mx-2">by</span>
                <input
                  className="border border-[#f1f1f1] rounded-md mt-4 px-2"
                  value={readContent(3)}
                  style={{
                    minWidth: `${String(readContent(3)).length}ch`,
                  }}
                  onChange={(event: any) =>
                    handleChangeContent(event?.target?.value, 3)
                  }
                />
                <span className="mx-2">.</span>
              </div>

              <div className="mt-10">
                <span>With this campaign, we wish to </span>
                <input
                  className="border border-[#f1f1f1] rounded-md px-2"
                  value={readContent(4)}
                  style={{
                    minWidth: `${String(readContent(4)).length}ch`,
                  }}
                  onChange={(event: any) =>
                    handleChangeContent(event?.target?.value, 4)
                  }
                />
                <span className="mx-2">.</span>
              </div>
            </div>
          )}

          <div className="mt-10">
            <Button
              label={
                state?.step === OnboardingStep.business_details
                  ? "Next"
                  : "Submit"
              }
              color="secondary"
              onClick={handleNextStep}
              style={{
                borderRadius: 10,
                fontSize: 16,
                color: "#FFFFFF",
                height: 50,
              }}
              fullWidth
              loaderButton
              loadingPosition="center"
              loading={state?.isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
