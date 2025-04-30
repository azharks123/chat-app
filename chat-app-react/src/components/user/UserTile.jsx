import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React from "react";

const UserTile = ({ user, onClick, onDelete }) => (
  <Card sx={{ mb: 2, cursor: "pointer", position: "relative" }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" onClick={onClick}>
        <Typography variant="h6">
          {user.username}
        </Typography>
        {onDelete && (
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
    </CardContent>
  </Card>
);

export default React.memo(UserTile);  