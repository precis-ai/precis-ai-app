import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Button from "components/Button";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import { useMergeState } from "utils/custom-hooks";
import Loader from "components/Loader";

export default function WorkspaceSettingsContainer() {
  const [state, setState] = useMergeState({
    isLoading: false,
    shouldEditWorkspaceDetails: false,

    name: "Acme, Inc.",

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

  const handleToggleEditWorkspaceDetails = () => {
    setState({
      shouldEditWorkspaceDetails: !state?.shouldEditWorkspaceDetails,
    });
  };

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

  const handleSave = () => {
    // if (!isFormValid()) {
    //   return;
    // }
  };

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Loader loading={state?.isLoading} />
        </div>
      ) : (
        <div className="flex justify-between">
          <div className="w-full lg:w-8/12">
            <div className="profile-box p-4">
              <div className="flex justify-between items-center">
                <div className="text-lg text-grey font-semibold">
                  Workspace Overview
                </div>

                <div>
                  <IconButton onClick={handleToggleEditWorkspaceDetails}>
                    <EditIcon />
                  </IconButton>
                </div>
              </div>

              <div className="w-full mt-5">
                <div className="font-medium">
                  <span>Creation date:</span>
                  <span className="ml-2">31st October, 2023</span>
                </div>

                <div className="mt-8">
                  <TextField
                    fullWidth
                    label="NAME"
                    variant="outlined"
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                    required
                    error={state?.errors?.name}
                    InputLabelProps={{
                      shrink: true,
                      disableAnimation: true,
                    }}
                    disabled={!state?.shouldEditWorkspaceDetails}
                  />

                  {state?.errors?.name && (
                    <ErrorMessage message="Workspace name is required" />
                  )}
                </div>

                {state?.shouldEditWorkspaceDetails && (
                  <div className="mt-4">
                    <Button
                      label="Save"
                      color="info"
                      onClick={handleSave}
                      style={{
                        borderRadius: 10,
                        fontSize: 16,
                        color: "#FFFFFF",
                        height: 40,
                      }}
                      loaderButton
                      loadingPosition="center"
                      loading={state?.isLoading}
                      disabled={state?.isLoading}
                    />
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
