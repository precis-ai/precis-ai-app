import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import SourceOutlinedIcon from "@mui/icons-material/SourceOutlined";
import WorkspacesOutlinedIcon from "@mui/icons-material/WorkspacesOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMergeState } from "utils/custom-hooks";

export const NAVS = [
  {
    id: "1",
    icon: SourceOutlinedIcon,
    title: "Posts",
    path: "/posts",
    childNavs: [
      {
        id: "11",
        title: "View Posts",
        path: "",
      },
      {
        id: "12",
        title: "Create Post",
        path: "/create",
      },
    ],
  },
  {
    id: "2",
    icon: WorkspacesOutlinedIcon,
    title: "Channels",
    path: "/channels",
    childNavs: [
      {
        id: "21",
        title: "View Channels",
        path: "",
      },
      {
        id: "22",
        title: "Connect Channel",
        path: "/connect",
      },
    ],
  },
  {
    id: "3",
    icon: SettingsOutlinedIcon,
    title: "Settings",
    path: "/settings",
    childNavs: [],
  },
];

type Props = {
  isLoggedIn: boolean;
  user: any;
  onLogout: () => void;
};

export default function Nav({ isLoggedIn, user, onLogout }: Props) {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [state, setState] = useMergeState({
    navs: [],
    selectedNav: NAVS[0],
    selectedChildNav: NAVS[0]?.childNavs?.length ? NAVS[0]?.childNavs[0] : null,
    profileMenuAnchorEl: null,
  });

  const handleNavChange = (nav: any) => {
    setState({ selectedNav: nav, selectedChildNav: nav.childNavs[0] });

    if (nav.childNavs[0]) {
      navigate(`${nav.path}${nav.childNavs[0].path}`);
    } else {
      navigate(`${nav.path}`);
    }
  };

  const handleChildNavChange = (childNav: any) => {
    setState({ selectedChildNav: childNav });
    navigate(`${state.selectedNav.path}${childNav.path}`);
  };

  const handleOpenProfileMenu = (event: any) => {
    setState({ profileMenuAnchorEl: event.currentTarget });
  };

  const handleCloseProfileMenu = () => {
    setState({ profileMenuAnchorEl: null });
  };

  const handleLogout = () => {
    handleCloseProfileMenu();
    onLogout();
  };

  useEffect(() => {
    const mainNav = pathname.split("/")[1];
    const nestedNav = pathname.split("/")[2];

    const topNav = NAVS.find((elem: any) => elem.path === `/${mainNav}`);

    if (topNav?.path) {
      setState({ selectedNav: topNav });

      if (nestedNav) {
        const childNav = topNav?.childNavs?.find(
          (elem: any) => elem.path === `/${nestedNav}`
        );

        if (childNav?.path) {
          setState({ selectedChildNav: childNav });
        }
      } else {
        setState({ selectedChildNav: topNav?.childNavs[0] });
      }
    }
  }, [pathname]);

  useEffect(() => {
    const navs = [...NAVS];

    setState({ navs });
  }, []);

  return (
    <div className="w-full h-screen">
      <div className="flex">
        <div className="w-16 max-w-[80px] flex flex-col justify-between">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-md mt-6 text-3xl font-semibold bg-primary text-white flex justify-center items-center">
              P
            </div>

            <div className="w-full flex flex-col items-center my-6">
              {state.navs.map((nav: any) => (
                <div
                  key={nav.id}
                  className={`w-full  flex justify-center py-1 ${
                    state.selectedNav?.id === nav.id
                      ? "bg-[#F6F7F8] border-l-2 border-[#F36]"
                      : ""
                  }`}
                >
                  {nav?.icon && (
                    <Tooltip title={nav.title} placement="right">
                      <IconButton onClick={() => handleNavChange(nav)}>
                        <nav.icon
                          sx={{
                            color:
                              state.selectedNav?.id === nav.id ? "#0a2032" : "",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isLoggedIn && (
            <div className="flex flex-col items-center mb-4">
              <div>
                <IconButton onClick={handleOpenProfileMenu}>
                  <Avatar sx={{ width: 34, height: 34 }}>
                    {String(user?.firstName?.charAt(0)).toUpperCase()}
                    {String(user?.lastName?.charAt(0)).toUpperCase()}
                  </Avatar>
                </IconButton>
              </div>

              <Menu
                anchorEl={state.profileMenuAnchorEl}
                open={Boolean(state.profileMenuAnchorEl)}
                onClose={handleCloseProfileMenu}
                transformOrigin={{ horizontal: "left", vertical: "top" }}
                anchorOrigin={{ horizontal: "left", vertical: "top" }}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>

        <div className="w-full max-w-[200px] h-screen bg-[#F6F7F8] flex flex-col justify-between items-center">
          <div className="py-8 w-10/12">
            <div className="flex text-2xl font-semibold">
              {state.selectedNav?.title}
            </div>

            <div className="mt-8 flex flex-col">
              {state.selectedNav?.childNavs.map((childNav: any) => (
                <div
                  key={childNav.id}
                  className={`w-full h-full flex mb-4 text-gray-500 text-sm ${
                    state.selectedChildNav?.id === childNav.id
                      ? "text-gray-900 font-medium"
                      : ""
                  }`}
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => handleChildNavChange(childNav)}
                  >
                    {childNav.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
