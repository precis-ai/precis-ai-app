import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSnackbar } from "notistack";

// layouts
import DefaultLayout from "layouts/default";

// containers

// auth
import SignInContainer from "containers/auth/signin";
import SignUpContainer from "containers/auth/signup";

// onboarding
import OnboardingContainer from "containers/onboarding";

// dashboard
import DashboardGettingStartedContainer from "containers/dashboard/getting-started";
import DashboardOverviewContainer from "containers/dashboard/overview";
import DashboardMarketingStrategyContainer from "containers/dashboard/marketing-strategy";
import DashboardMarketingStrategyCreateContainer from "containers/dashboard/marketing-strategy/create";

// Twitter callback
import AuthTwitterCallbackContainer from "containers/auth/twitter/callback";

// LinkedIn callback
import AuthLinkedInCallbackContainer from "containers/auth/linkedin/callback";

// posts
import PostsContainer from "containers/posts";
import CreatePostContainer from "containers/posts/create";

// channels
import ChannelsContainer from "containers/channels";
import ChannelsConnectContainer from "containers/channels/connect";

// ai-tools
import AIToolsContainer from "containers/ai-tools";
import AIToolsUsageHistoryContainer from "containers/ai-tools/usage-history";
import AIToolsRunContainer from "containers/ai-tools/run";

// settings
import SettingsContainer from "containers/settings";
import TeamSettingsContainer from "containers/settings/team";

// components
import Loader from "components/Loader";
import PageNotFound from "components/PageNotFound";
import ProtectedRoute from "components/ProtectedRoute";

// utils
import { useMergeState } from "utils/custom-hooks";

// api
import { getCurrentUser } from "api";
import { PRECIS_AI_TOKEN } from "utils/constants";

export default function RoutesContainer() {
  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoggedIn: false,
    user: {},
  });

  const isAppLoading =
    localStorage.getItem(PRECIS_AI_TOKEN) && !state?.isLoggedIn;

  const setUser = (user: any) => {
    setState({ isLoggedIn: true, user });
  };

  const onLogout = () => {
    localStorage.removeItem(PRECIS_AI_TOKEN);
    window.location.href = "/";
  };

  const init = async () => {
    try {
      if (!localStorage.getItem(PRECIS_AI_TOKEN)) {
        return;
      }

      const response = await getCurrentUser();

      if (response?.success) {
        setUser(response?.data?.user);
      }
    } catch (error: any) {
      localStorage.removeItem(PRECIS_AI_TOKEN);

      window.location.href = "/";

      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {isAppLoading ? (
        <div className="w-full h-screen flex justify-center mt-10">
          <Loader loading={isAppLoading} />
        </div>
      ) : (
        <Routes>
          <Route
            path="signin"
            element={<SignInContainer setUser={setUser} />}
          />

          <Route
            path="signup"
            element={<SignUpContainer setUser={setUser} />}
          />

          <Route
            path="auth/twitter/callback"
            element={<AuthTwitterCallbackContainer />}
          />

          <Route
            path="auth/linkedin/callback"
            element={<AuthLinkedInCallbackContainer />}
          />

          <Route element={<ProtectedRoute isLoggedIn={state?.isLoggedIn} />}>
            <Route path="onboarding" element={<OnboardingContainer />} />
          </Route>

          <Route
            path="/"
            element={
              <DefaultLayout
                isLoggedIn={state?.isLoggedIn}
                user={state?.user}
                onLogout={onLogout}
              />
            }
          >
            <Route element={<ProtectedRoute isLoggedIn={state?.isLoggedIn} />}>
              <Route path="dashboard">
                <Route
                  path="getting-started"
                  element={
                    <DashboardGettingStartedContainer user={state?.user} />
                  }
                />
                <Route
                  path=""
                  element={<DashboardOverviewContainer user={state?.user} />}
                />
                <Route path="marketing-strategy">
                  <Route
                    path=""
                    element={<DashboardMarketingStrategyContainer />}
                  />
                  <Route
                    path="create"
                    element={
                      <DashboardMarketingStrategyCreateContainer
                        user={state?.user}
                      />
                    }
                  />
                </Route>
              </Route>

              <Route path="posts">
                <Route path="" element={<PostsContainer />} />
                <Route path="create" element={<CreatePostContainer />} />
              </Route>

              <Route path="channels">
                <Route path="" element={<ChannelsContainer />} />
                <Route path="connect" element={<ChannelsConnectContainer />} />
              </Route>

              <Route path="ai-tools">
                <Route path="" element={<AIToolsContainer />} />
                <Route
                  path="usage-history"
                  element={<AIToolsUsageHistoryContainer />}
                />
                <Route path="run" element={<AIToolsRunContainer />} />
              </Route>

              <Route path="settings">
                <Route
                  path=""
                  element={
                    <SettingsContainer user={state?.user} setUser={setUser} />
                  }
                />
                <Route path="team" element={<TeamSettingsContainer />} />
              </Route>
            </Route>

            <Route
              path="/"
              element={
                <Navigate to={state?.isLoggedIn ? "/posts" : "/signin"} />
              }
            />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      )}
    </div>
  );
}
