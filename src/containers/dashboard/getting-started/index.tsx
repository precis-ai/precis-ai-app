import React from "react";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useMergeState } from "utils/custom-hooks";
import Loader from "components/Loader";

type Props = {
  user: any;
};

export default function DashboardGettingStartedContainer({ user }: Props) {
  const [state, setState] = useMergeState({
    isLoading: false,
    onboardingCompleted: false,
    socialAccountConnected: false,
    postSent: false,
    postScheduled: false,
    aiToolUsed: false,
    invitedTeamMembers: false,
    completedPercentage: 0,
  });

  React.useEffect(() => {
    setState({
      onboardingCompleted: user?.workspace?.onboardingCompleted,
      socialAccountConnected: user?.workspace?.socialAccountConnected,
      postSent: user?.workspace?.postSent,
      postScheduled: user?.workspace?.postScheduled,
      aiToolUsed: user?.workspace?.aiToolUsed,
      invitedTeamMembers: user?.workspace?.invitedTeamMembers,
    });

    const steps = [
      user?.workspace?.onboardingCompleted,
      user?.workspace?.socialAccountConnected,
      user?.workspace?.postSent,
      user?.workspace?.postScheduled,
      user?.workspace?.aiToolUsed,
      user?.workspace?.invitedTeamMembers,
    ];

    let completedCount = 0;

    steps.forEach((elem) => {
      if (elem) {
        completedCount += 1;
      }
    });

    setState({ completedPercentage: (completedCount / steps.length) * 100 });
  }, []);

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Loader loading={state?.isLoading} />
        </div>
      ) : (
        <div>
          <div className="text-4xl font-semibold text-grey mb-4">
            Get Started
          </div>

          <div className="box my-8">
            <div className="text-grey text-3xl font-medium mb-8">
              Let&apos;s get you started
            </div>

            <div className="p-3">
              <div className="bg-white w-full h-4 rounded-3xl border-[1px] relative">
                <div
                  className="bg-[#55AB68] h-full rounded-3xl"
                  style={{ width: `${state?.completedPercentage}%` }}
                />
              </div>
            </div>

            <Link
              to="/onboarding"
              className="flex justify-between items-center p-2 cursor-pointer relative my-4 hover:shadow-md"
            >
              <div className="flex items-center">
                {state?.onboardingCompleted ? (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#49935A",
                      }}
                    />
                  </div>
                ) : (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#e7e7e7",
                      }}
                    />
                  </div>
                )}

                <div className="text-grey">
                  Complete onboarding questionnaire
                </div>
              </div>

              <ChevronRightIcon />
            </Link>

            <Link
              to="/channels/connect"
              className="flex justify-between items-center p-2 cursor-pointer hover:shadow-md my-4"
            >
              <div className="flex items-center">
                {state?.socialAccountConnected ? (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#49935A",
                      }}
                    />
                  </div>
                ) : (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#e7e7e7",
                      }}
                    />
                  </div>
                )}

                <div className="text-grey">
                  Connect your social media accounts
                </div>
              </div>

              <ChevronRightIcon />
            </Link>

            <Link
              to="/posts/create"
              className="flex justify-between items-center p-2 cursor-pointer hover:shadow-md my-4"
            >
              <div className="flex items-center">
                {state?.postSent ? (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#49935A",
                      }}
                    />
                  </div>
                ) : (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#e7e7e7",
                      }}
                    />
                  </div>
                )}

                <div className="text-grey">Create a post</div>
              </div>

              <ChevronRightIcon />
            </Link>

            <Link
              to="/posts/create"
              className="flex justify-between items-center p-2 cursor-pointer hover:shadow-md my-4"
            >
              <div className="flex items-center">
                {state?.postScheduled ? (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#49935A",
                      }}
                    />
                  </div>
                ) : (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#e7e7e7",
                      }}
                    />
                  </div>
                )}

                <div className="text-grey">Schedule a post</div>
              </div>

              <ChevronRightIcon />
            </Link>

            <Link
              to="/ai-tools"
              className="flex justify-between items-center p-2 cursor-pointer hover:shadow-md my-4"
            >
              <div className="flex items-center">
                {state?.aiToolUsed ? (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#49935A",
                      }}
                    />
                  </div>
                ) : (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#e7e7e7",
                      }}
                    />
                  </div>
                )}

                <div className="text-grey">Try AI tools</div>
              </div>

              <ChevronRightIcon />
            </Link>

            <Link
              to="/settings"
              className="flex justify-between items-center p-2 cursor-pointer hover:shadow-md my-4"
            >
              <div className="flex items-center">
                {state?.invitedTeamMembers ? (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#49935A",
                      }}
                    />
                  </div>
                ) : (
                  <div className="mr-2">
                    <CheckCircleIcon
                      sx={{
                        color: "#e7e7e7",
                      }}
                    />
                  </div>
                )}

                <div className="text-grey">Invite team members</div>
              </div>

              <ChevronRightIcon />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
