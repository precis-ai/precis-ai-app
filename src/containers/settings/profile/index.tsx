import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Button from "components/Button";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import { useMergeState } from "utils/custom-hooks";
import Loader from "components/Loader";

export default function ProfileSettingsContainer() {
  const [state, setState] = useMergeState({
    isLoading: false,
    shouldEditProfileDetails: false,

    firstName: "Nihal",
    lastName: "K",
    email: "nihal.kaul@sjsu.edu",

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

  const handleToggleEditProfileDetails = () => {
    setState({ shouldEditProfileDetails: !state?.shouldEditProfileDetails });
  };

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (!state.firstName) {
      payload = { firstName: true, ...payload };
      isValid = false;
    }

    if (!state.lastName) {
      payload = { lastName: true, ...payload };
      isValid = false;
    }

    if (!state.email) {
      payload = { email: true, ...payload };
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
                  Profile Overview
                </div>

                <div>
                  <IconButton onClick={handleToggleEditProfileDetails}>
                    <EditIcon />
                  </IconButton>
                </div>
              </div>

              <div className="w-full mt-5">
                <div>
                  <TextField
                    fullWidth
                    label="FIRST NAME"
                    variant="outlined"
                    name="firstName"
                    value={state.firstName}
                    onChange={handleChange}
                    required
                    error={state?.errors?.firstName}
                    InputLabelProps={{
                      shrink: true,
                      disableAnimation: true,
                    }}
                    disabled={!state?.shouldEditProfileDetails}
                  />

                  {state?.errors?.firstName && (
                    <ErrorMessage message="First name is required" />
                  )}
                </div>

                <div className="mt-4">
                  <TextField
                    fullWidth
                    label="LAST NAME"
                    variant="outlined"
                    name="lastName"
                    value={state.lastName}
                    onChange={handleChange}
                    required
                    error={state?.errors?.lastName}
                    InputLabelProps={{
                      shrink: true,
                      disableAnimation: true,
                    }}
                    disabled={!state?.shouldEditProfileDetails}
                  />

                  {state?.errors?.lastName && (
                    <ErrorMessage message="Last name is required" />
                  )}
                </div>

                <div className="mt-4">
                  <TextField
                    fullWidth
                    label="EMAIL"
                    variant="outlined"
                    name="email"
                    value={state.email}
                    onChange={handleChange}
                    required
                    error={state?.errors?.email}
                    InputLabelProps={{
                      shrink: true,
                      disableAnimation: true,
                    }}
                    disabled={!state?.shouldEditProfileDetails}
                  />

                  {state?.errors?.lastName && (
                    <ErrorMessage message="Email is required" />
                  )}
                </div>

                {state?.shouldEditProfileDetails && (
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
