import Button from "components/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Dialog, DialogTitle } from "components/Dialog";
import TextField from "components/TextField";
import ErrorMessage from "components/ErrorMessage";
import { useMergeState } from "utils/custom-hooks";
import { UserRoles } from "utils/constants";

type Props = {
  open: boolean;
  onClose: any;
  onSubmit: any;
};

export const userRolesList = [
  {
    label: "Admin",
    value: UserRoles.ADMIN,
  },
  {
    label: "Member",
    value: UserRoles.MEMBER,
  },
];

export default function InviteMemberDialog({ open, onClose, onSubmit }: Props) {
  const [state, setState] = useMergeState({
    email: "",
    role: "",
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

    if (!state.email) {
      payload = { email: true, ...payload };
      isValid = false;
    }

    if (!state.role) {
      payload = { role: true, ...payload };
      isValid = false;
    }

    setState({ errors: { ...payload } });

    return isValid;
  };

  const handleSendInvitation = async () => {
    if (!isFormValid()) {
      return;
    }

    onSubmit(state?.email, state?.role);
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle onClose={onClose}>Invite Member</DialogTitle>

      <DialogContent dividers>
        <div className="my-4">
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
            // disabled={isInvitingMembers}
          />

          {state?.errors?.email && <ErrorMessage message="Email is required" />}
        </div>

        <div className="my-8">
          <FormControl variant="outlined" className="input-select-field">
            <InputLabel
              shrink
              disableAnimation
              className="input-label"
              required
            >
              ROLE
            </InputLabel>

            <Select
              fullWidth
              variant="outlined"
              label="ROLE"
              name="role"
              value={state.role}
              onChange={handleChange}
              color="secondary"
              required
              // disabled={isInvitingMembers}
            >
              {userRolesList.map((item: any) => (
                <MenuItem key={item.label} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {state?.errors?.role && <ErrorMessage message="Role is required" />}
        </div>
      </DialogContent>

      <DialogActions>
        <div className="my-2">
          <Button
            label="Send Invitation"
            color="info"
            onClick={handleSendInvitation}
            style={{
              borderRadius: 4,
              fontSize: 14,
              color: "#FFFFFF",
              height: 40,
            }}
            // loaderButton
            // loadingPosition="center"
            // loading={isInvitingMembers}
            // disabled={isInvitingMembers}
          />
        </div>
      </DialogActions>
    </Dialog>
  );
}
