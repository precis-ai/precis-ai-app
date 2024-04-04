import React from "react";
import { useSnackbar } from "notistack";
import Avatar from "@mui/material/Avatar";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "components/Button";
import Loader from "components/Loader";
import InviteMemberDialog from "components/InviteMemberDialog";
import { wrapFullName } from "utils/common";
import { useMergeState } from "utils/custom-hooks";
import { inviteMember, listMembers } from "api";

export default function TeamSettingsContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
    members: [],
    shouldShowInviteMemberDialog: false,
  });

  const handleOpenInviteMemberDialog = () => {
    setState({ shouldShowInviteMemberDialog: true });
  };

  const handleCloseInviteMemberDialog = () => {
    setState({ shouldShowInviteMemberDialog: false });
  };

  const handleSubmitInviteMemberDialog = async (
    email: string,
    role: string
  ) => {
    try {
      const response = await inviteMember({
        email: String(email).trim().toLowerCase(),
        role,
      });

      if (response?.success) {
        enqueueSnackbar(response?.message, { variant: "success" });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message, { variant: "error" });
    } finally {
      handleCloseInviteMemberDialog();
    }
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await listMembers();

      if (response?.success) {
        setState({ members: response?.data });
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
          <div className="flex items-center justify-between">
            <div className="text-4xl font-semibold text-grey">Team</div>
            <div>
              <Button
                label="Invite Member"
                color="secondary"
                onClick={handleOpenInviteMemberDialog}
                style={{
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#FFFFFF",
                  height: 40,
                }}
              />
            </div>
          </div>

          <TableContainer className="mt-10">
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span className="text-grey">Name</span>
                  </TableCell>
                  <TableCell align="center">
                    <span className="text-grey">Role</span>
                  </TableCell>
                  <TableCell align="center">
                    <span className="text-grey">Status</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ overflow: "visible" }}>
                {state?.members?.map((member: any) => (
                  <TableRow key={member._id}>
                    <TableCell component="th" scope="row">
                      <div className="flex items-center">
                        <Avatar sx={{ width: 34, height: 34 }}>
                          {member?.status === "INVITED" ? (
                            String(member?.email?.charAt(0)).toUpperCase()
                          ) : (
                            <span>
                              {String(
                                member?.firstName?.charAt(0)
                              ).toUpperCase()}
                              {String(
                                member?.lastName?.charAt(0)
                              ).toUpperCase()}
                            </span>
                          )}
                        </Avatar>
                        <span className="text-grey text-sm ml-2">
                          {member?.status === "INVITED"
                            ? member?.email
                            : wrapFullName(member?.firstName, member?.lastName)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">{member?.role}</span>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <span className="text-grey text-xs">
                        {member?.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {!state?.members.length && (
            <div className="flex justify-center mt-10">
              <div className="text-grey text-xl">
                Start by inviting a member
              </div>
            </div>
          )}
        </div>
      )}

      {state?.shouldShowInviteMemberDialog && (
        <InviteMemberDialog
          open={state?.shouldShowInviteMemberDialog}
          onClose={handleCloseInviteMemberDialog}
          onSubmit={handleSubmitInviteMemberDialog}
        />
      )}
    </div>
  );
}
