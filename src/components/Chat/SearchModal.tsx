import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, CircularProgress } from "@mui/material";
import baseUrl from "../../utils/baseURL";

type Props = {
  users: any[];
  checked: any[];
  setChecked: Function;
};

function CheckboxListSecondary({ users, setChecked, checked }: Props) {
  const handleToggle = (user: any) => () => {
    const currentIndex = checked.findIndex((item) => item._id === user._id);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(user);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  if (users.length === 0) return <p>No user found</p>;

  return (
    <List dense sx={{ width: "100%" }}>
      {users?.map((user) => {
        const labelId = `checkbox-list-secondary-label-${user._id}`;
        return (
          <ListItem
            key={user}
            onClick={handleToggle(user)}
            secondaryAction={
              <Checkbox
                edge="end"
                checked={checked.some((item) => item._id === user._id)}
                inputProps={{ "aria-labelledby": labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar alt={user?.name} src={user?.avatar} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={user?.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}

type PropsTypes = {
  user: any;
  openModal: boolean;
  setOpenModal: Function;
};

export default function FormDialog({
  user,
  openModal,
  setOpenModal,
}: PropsTypes) {
  const handleClose = () => {
    setOpenModal(false);
  };

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<any>([]);
  const [timerId, setTimerId] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = React.useState<any[]>([]);

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

  const onkeyUp = (event: any) => {
    clearTimeout(timerId);
    const value = event.target.value;
    setSearch(value);
    setTimerId(
      setTimeout(() => {
        if (value) fetchUsers(value);
      }, 1000)
    );
  };

  //select user handler
  const handleSelect = async () => {
    //create conversation
    const conversation: any = {
      participants: checked.map((item) => item._id),
      type: checked.length > 1 ? "group" : "dual",
      creator: user._id,
      name: checked[0].name,
    };

    if (conversation.type === "group") {
      conversation.name = checked.map((item) => item.name).join(", ");
    }

    //hit create conversation api
    try {
      const { data } = await baseUrl.post("conversations", conversation);
      window.location.href = `?conversationId=${data.data._id}`;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog maxWidth="xs" open={openModal} onClose={handleClose} fullWidth>
      <DialogTitle>Create Conversation</DialogTitle>
      <DialogContent sx={{ padding: 1 }}>
        <DialogContentText>Search user user email, name</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Search text"
          type="text"
          fullWidth
          variant="standard"
          onKeyDown={onkeyDown}
          onKeyUp={onkeyUp}
          InputProps={{
            endAdornment: (
              <Box sx={{ display: "flex" }}>
                {loading && <CircularProgress size="20px" />}
              </Box>
            ),
          }}
        />
        {search && (
          <CheckboxListSecondary
            checked={checked}
            setChecked={setChecked}
            users={users}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSelect}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
