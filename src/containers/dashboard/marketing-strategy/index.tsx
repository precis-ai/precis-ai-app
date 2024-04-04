import React from "react";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import Button from "components/Button";
import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";
import { wrapFullName } from "utils/common";
import { listMarketingStrategies } from "api";

export default function DashboardMarketingStrategyContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [state, setState] = useMergeState({
    isLoading: false,
    strategies: [],
  });

  const handleCreateStrategy = () => {
    navigate("/dashboard/marketing-strategy/create");
  };

  const init = async () => {
    try {
      setState({ isLoading: true });

      const response = await listMarketingStrategies();

      if (response?.success) {
        setState({ strategies: response?.data });
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
          <div className="md:flex md:justify-between md:items-center">
            <div className="text-4xl font-semibold text-grey">
              Marketing Strategy
            </div>

            <div className="md:flex mt-4 md:mt-0">
              <Button
                label="Create New Strategy"
                color="secondary"
                onClick={handleCreateStrategy}
                style={{
                  borderRadius: 4,
                  fontSize: 14,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  height: 40,
                }}
              />
            </div>
          </div>

          <div className="mt-10">
            <TableContainer>
              <Table sx={{ minWidth: 750 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <span className="text-grey">Sr. No.</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-grey">User</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-grey">Actions</span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ overflow: "visible" }}>
                  {state?.strategies?.map((strategy: any, index: number) => (
                    <TableRow key={strategy._id}>
                      <TableCell component="th" scope="row">
                        <span className="text-grey text-xs">{index + 1}</span>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <div className="flex items-center">
                          <Avatar sx={{ width: 34, height: 34 }}>
                            <span>
                              {String(
                                strategy?.user?.firstName?.charAt(0)
                              ).toUpperCase()}
                              {String(
                                strategy?.user?.lastName?.charAt(0)
                              ).toUpperCase()}
                            </span>
                          </Avatar>
                          <span className="text-grey text-sm ml-2">
                            {wrapFullName(
                              strategy?.user?.firstName,
                              strategy?.user?.lastName
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Link
                          to={`/dashboard/marketing-strategy/create?id=${strategy?._id}`}
                        >
                          <LinkOutlinedIcon />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {!state?.strategies.length && (
              <div className="flex justify-center mt-10">
                <div className="text-grey text-xl">
                  Start by creating a strategy
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
