import dayjs from "dayjs";
import DialogContent from "@mui/material/DialogContent";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Button from "components/Button";
import { Dialog, DialogTitle } from "components/Dialog";
import { useMergeState } from "utils/custom-hooks";

type Props = {
  open: boolean;
  onClose: any;
  onSubmit: any;
};

export default function PostDialog({ open, onClose, onSubmit }: Props) {
  const [state, setState] = useMergeState({
    shouldSchedulePost: false,
    timestamp: null,
    errors: {},
  });

  const isFormValid = () => {
    let isValid = true;

    let payload = {};

    if (state?.shouldSchedulePost && !state.timestamp) {
      payload = { timestamp: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const toggleSchedulePost = () => {
    setState({ shouldSchedulePost: !state?.shouldSchedulePost });
  };

  const handleTimestampChange = (newValue: any) => {
    setState({ timestamp: newValue });
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }

    return onSubmit(
      state?.timestamp ? dayjs(state?.timestamp).valueOf() : null
    );
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose}>Confirm Post</DialogTitle>

      <DialogContent dividers>
        <div className="flex justify-center my-8">
          <div className="w-1/2">
            {!state?.shouldSchedulePost ? (
              <div>
                <div className="my-2">
                  <Button
                    label="Post Now"
                    color="secondary"
                    onClick={handleSubmit}
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
                    loading={state?.isSendingPost}
                  />
                </div>

                <div className="text-center text-xl my-4">OR</div>

                <div className="my-2">
                  <Button
                    label="Schedule for later"
                    color="info"
                    onClick={toggleSchedulePost}
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
                    loading={state?.isSendingPost}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-center pb-8">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Select date and time"
                      value={state.timestamp}
                      onChange={handleTimestampChange}
                    />
                  </LocalizationProvider>
                </div>

                <div className="pt-8">
                  <Button
                    label="Confirm schedule post"
                    color="secondary"
                    onClick={handleSubmit}
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
                    loading={state?.isSendingPost}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
