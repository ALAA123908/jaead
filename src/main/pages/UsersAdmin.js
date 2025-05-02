import React from "react";
import { Typography, Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function UsersAdmin() {
  // بيانات وهمية للمستخدمين
  const [users, setUsers] = React.useState([
    { id: 1, name: "أحمد محمد", phone: "0500000001" },
    { id: 2, name: "سارة علي", phone: "0500000002" },
    { id: 3, name: "جواد سعيد", phone: "0500000003" }
  ]);
  const handleDelete = id => setUsers(users.filter(u => u.id !== id));
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        إدارة المستخدمين
      </Typography>
      <List>
        {users.map(user => (
          <ListItem
            key={user.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(user.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText primary={user.name} secondary={user.phone} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default UsersAdmin;
