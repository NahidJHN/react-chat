import Avatar from "@mui/material/Avatar";

import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

interface PropTypes {
  isOnline: boolean;
  userName: string;
  userAvatar: string;
}

interface BadgeOwnProps {
  isOnline: boolean;
}

const StyledBadge = styled(Badge)<BadgeOwnProps>(({ theme, isOnline }) => {
  return {
    "& .MuiBadge-badge": {
      ...(isOnline && {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        "&::after": {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          border: "1px solid currentColor",
          content: '""',
        },
      }),
    },
  };
});

function UserAvatar(props: PropTypes) {
  return (
    <StyledBadge
      isOnline={props.isOnline}
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      <Avatar alt={props.userName} src={props.userAvatar} />
    </StyledBadge>
  );
}

export default UserAvatar;
