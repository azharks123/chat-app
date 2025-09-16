import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import styles from "./UserTile.module.css";

const UserTile = ({ user, onClick, onDelete, isActive, isUnread }) => (
  <Card onClick={onClick}>
    <CardContent
      className={`${styles.card} ${isUnread ? styles.cardUnread : ""}`}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h6"
          className={`${styles.username} ${
            isUnread ? styles.usernameUnread : ""
          }`}
        >
          {user.username}
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          {isUnread && <span className={styles.unreadDot} />}

          {isActive && onDelete && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default React.memo(UserTile);
