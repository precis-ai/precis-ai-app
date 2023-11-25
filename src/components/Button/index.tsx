import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";

type Props = {
  id?: string;
  label: any;
  onClick?: any;
  href?: any;
  type?: any;
  variant?: any;
  color?: any;
  disabled?: boolean;
  startIcon?: any;
  loading?: boolean;
  loadingPosition?: "start" | "end" | "center" | undefined;
  loaderButton?: boolean;
  fullWidth?: boolean;
  style?: any;
};

const StyledButton = styled(MuiButton)(({ theme }: any) => ({
  backgroundColor: theme.palette.primary,
  textTransform: "none",
  fontSize: 16,
  fontFamily: "Poppins",
}));

const StyledLoadingButton = styled(LoadingButton)(({ theme }: any) => ({
  backgroundColor: theme.palette.primary,
  textTransform: "none",
  fontSize: 16,
  fontFamily: "Poppins",
}));

export default function Button(props: Props) {
  const {
    id,
    onClick,
    href,
    label,
    type,
    variant = "contained",
    color,
    disabled = false,
    startIcon = null,
    loading,
    loadingPosition,
    loaderButton = false,
    fullWidth = false,
    style = {},
  } = props;

  return (
    <div>
      {!loaderButton ? (
        <StyledButton
          id={id}
          variant={variant}
          href={href}
          onClick={onClick}
          type={type}
          color={color}
          disableElevation
          disabled={disabled}
          startIcon={startIcon}
          fullWidth={fullWidth}
          style={style}
        >
          {label}
        </StyledButton>
      ) : (
        <StyledLoadingButton
          id={id}
          variant={variant}
          onClick={onClick}
          type={type}
          color={color}
          disableElevation
          disabled={disabled}
          startIcon={startIcon}
          loading={loading}
          loadingPosition={loadingPosition}
          fullWidth={fullWidth}
          style={style}
        >
          {loading ? "" : label}
        </StyledLoadingButton>
      )}
    </div>
  );
}
