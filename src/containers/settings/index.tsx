import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProfileSettingsContainer from "./general/profile";
import WorkspaceSettingsContainer from "./general/workspace";
import { useMergeState } from "utils/custom-hooks";

const SETTINGS_TABS_TYPE = {
  PROFILE: "PROFILE",
  WORKSPACE: "WORKSPACE",
};

const SETTINGS_TABS = [
  {
    label: "Profile",
    value: SETTINGS_TABS_TYPE.PROFILE,
  },
  {
    label: "Workspace",
    value: SETTINGS_TABS_TYPE.WORKSPACE,
  },
];

type Props = {
  user: any;
  setUser: (user: any) => void;
};

export default function SettingsContainer({ user, setUser }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTabType = searchParams.get("tab");

  const [state, setState] = useMergeState({
    selectedTab: {},
  });

  const handleTabChange = (event: any, newTabType: number) => {
    setState({
      selectedTab: SETTINGS_TABS.find((elem: any) => elem.value === newTabType),
    });
  };

  useEffect(() => {
    let tab = "";

    if (state?.selectedTab?.value !== selectedTabType) {
      if (selectedTabType && !state?.selectedTab?.value) {
        tab = selectedTabType;
      } else if (state?.selectedTab?.value) {
        tab = state?.selectedTab?.value;
      } else {
        tab = SETTINGS_TABS_TYPE.PROFILE;
      }

      const selectedTab =
        SETTINGS_TABS.find((elem) => elem.value === tab) || SETTINGS_TABS[0];

      setSearchParams({ tab });

      setState({ selectedTab });
    }
  }, [state?.selectedTab]);

  return (
    <div>
      <div className="text-4xl font-semibold text-grey mb-4">Settings</div>

      {state?.selectedTab?.value && (
        <div className="mt-8">
          <Tabs value={state?.selectedTab?.value} onChange={handleTabChange}>
            {SETTINGS_TABS.map((tab) => (
              <Tab
                key={tab.label}
                label={tab.label}
                value={tab.value}
                style={{
                  textTransform: "none",
                  color: "#363333",
                  fontSize: 16,
                  fontFamily: "Poppins",
                }}
              />
            ))}
          </Tabs>
        </div>
      )}

      <div className="my-10">
        {state?.selectedTab?.value === SETTINGS_TABS_TYPE.PROFILE && (
          <ProfileSettingsContainer user={user} setUser={setUser} />
        )}

        {state?.selectedTab?.value === SETTINGS_TABS_TYPE.WORKSPACE && (
          <WorkspaceSettingsContainer user={user} setUser={setUser} />
        )}
      </div>
    </div>
  );
}
