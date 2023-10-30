import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import baseUrl from "../../utils/baseURL";

type PropTypes = {
  user: any;
};

function SearchUser(props: PropTypes) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any>([]);
  const [timerId, setTimerId] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  //fetch user func
  const fetchUsers = async (searchTerms: string) => {
    setLoading(true);
    try {
      const { data } = await baseUrl.get(`users?name=${searchTerms}`);
      setUsers(data.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onkeyDown = (_event: React.KeyboardEvent<HTMLInputElement>) => {
    if (timerId) clearTimeout(timerId);
  };

  const onkeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    clearTimeout(timerId);
    const value = event.currentTarget.value;
    setSearch(value);
    setTimerId(
      setTimeout(() => {
        if (value) fetchUsers(value);
      }, 1000)
    );
  };

  //select user handler
  const handleSelect = (participant: any) => async () => {
    //create conversation
    const conversation = {
      creator: props.user?._id,
      participant: participant._id,
    };

    const createConversation = async () => {
      //hit create conversation api
      try {
        const { data } = await baseUrl.post("conversations", conversation);
        window.location.href = `?conversationId=${data.data._id}`;
      } catch (error) {
        console.log(error);
      }
    };

    await createConversation();
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        width: "95%",
        justifyContent: "center",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "grey.500",
        position: "relative",
        marginX: "auto",
        marginBottom: 1,
      }}
    >
      <IconButton type="button" sx={{ p: "2px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search user"
        inputProps={{ "aria-label": "search user" }}
        onKeyDown={onkeyDown}
        onKeyUp={onkeyUp}
      />
      {search && (
        <List
          dense
          sx={{
            width: "100%",
            position: "absolute",
            zIndex: 1,
            top: 40,
            minHeight: 400,
            overflowY: "auto",
            borderRadius: 2,
            backgroundColor: "background.paper",
            border: "1px solid #ddd",
            padding: 2,
          }}
        >
          <Typography variant="h6" margin={1} color="ActiveBorder">
            Search result
          </Typography>
          {loading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}
          <Divider />

          {users.map((user: any, index: number) => {
            const labelId = `checkbox-list-secondary-label-${user}`;

            return (
              <React.Fragment key={user?._id}>
                <ListItem
                  disablePadding
                  sx={{
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "info.main" },
                  }}
                  onClick={handleSelect(user)}
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar alt={`Avatar n°${user + 1}`} src={user.avatar} />
                    </ListItemAvatar>
                    <ListItemText id={labelId} primary={user.name} />
                  </ListItemButton>
                </ListItem>
                {index !== users.length - 1 && <Divider sx={{ padding: 0 }} />}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
}

export default SearchUser;
