import { useNavigate } from "react-router-dom";
import Button from "components/Button";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { TextField } from "@mui/material";
import ErrorMessage from "components/ErrorMessage";

export default function CreatePostContainer() {
  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,
    description: "",
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

  const handleCreatePost = () => {
    navigate("/posts");
  };

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Loader loading={state?.isLoading} />
        </div>
      ) : (
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
              <Button
                label="Generate"
                color="secondary"
                onClick={handleCreatePost}
                style={{
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  height: 40,
                }}
              />
            </div>

            {/* <hr className="my-8" /> */}
          </div>
        </div>
      )}
    </div>
  );
}
