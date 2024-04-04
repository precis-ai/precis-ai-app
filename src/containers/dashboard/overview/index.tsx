import Loader from "components/Loader";
import { useMergeState } from "utils/custom-hooks";

type Props = {
  user: any;
};

export default function DashboardOverviewContainer({ user }: Props) {
  const [state, setState] = useMergeState({
    isLoading: false,
  });

  return (
    <div>
      {state?.isLoading ? (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Loader loading={state?.isLoading} />
        </div>
      ) : (
        <div>
          <div className="text-4xl font-semibold text-grey">
            Welcome, {user?.firstName}!
          </div>
        </div>
      )}
    </div>
  );
}
