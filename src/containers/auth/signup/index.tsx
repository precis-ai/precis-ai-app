import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import Button from "components/Button";
import { useMergeState } from "utils/custom-hooks";
import { signup } from "api";
import { PRECIS_AI_TOKEN } from "utils/constants";

type Props = {
  setUser: (user: any) => void;
};

export default function SignupContainer({ setUser }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,

    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

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

    if (!state.password) {
      payload = { password: true, ...payload };
      isValid = false;
    }

    if (!state.confirmPassword) {
      payload = { confirmPassword: true, ...payload };
      isValid = false;
    }

    if (state.password !== state.confirmPassword) {
      payload = { confirmPassword: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSignup = async () => {
    try {
      if (!isFormValid()) {
        return;
      }

      const response = await signup({
        firstName: state?.firstName,
        lastName: state?.lastName,
        email: state?.email,
        password: state?.password,
        confirmPassword: state?.confirmPassword,
      });

      if (response?.success) {
        localStorage.setItem(PRECIS_AI_TOKEN, response?.data?.token);

        setUser(response?.data?.user);

        navigate("/posts");
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-red-light">
      <div className="bg-white opacity-90 rounded-lg w-11/12 md:w-3/5 lg:w-2/5 pt-5 pb-10 pl-10 pr-10 md:pl-20 md:pr-20 flex items-center mt-10 mb-10">
        <div className="w-full">
          <div className="flex justify-center text-grey text-xl">
            Let&apos;s get started
          </div>

          <div className="mt-10">
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
                autoComplete="off"
              />

              {state?.errors?.firstName && (
                <ErrorMessage message="First name is required" />
              )}
            </div>

            <div className="mt-5">
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
                autoComplete="off"
              />

              {state?.errors?.lastName && (
                <ErrorMessage message="Last name is required" />
              )}
            </div>

            <div className="mt-5">
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
                autoComplete="off"
              />

              {state?.errors?.email && (
                <ErrorMessage message="Email is required" />
              )}
            </div>

            <div className="mt-5">
              <TextField
                fullWidth
                type="password"
                label="PASSWORD"
                variant="outlined"
                name="password"
                value={state.password}
                onChange={handleChange}
                required
                error={state?.errors?.password}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
                autoComplete="off"
              />

              {state?.errors?.password && (
                <ErrorMessage message="Password is required" />
              )}
            </div>

            <div className="mt-5">
              <TextField
                fullWidth
                type="password"
                label="CONFIRM PASSWORD"
                variant="outlined"
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={handleChange}
                required
                error={state?.errors?.confirmPassword}
                InputLabelProps={{
                  shrink: true,
                  disableAnimation: true,
                }}
                autoComplete="off"
              />

              {state?.errors?.confirmPassword && (
                <ErrorMessage message="Please re-enter your password" />
              )}
            </div>

            <div className="mt-10">
              <Button
                label="Create Your Account"
                color="secondary"
                onClick={handleSignup}
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

            <div className="text-grey text-xs mt-5">
              Already have an account?{" "}
              <Link to="/signin" className="underline">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
