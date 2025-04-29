import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const UserTile = ({ user, onClick, onDelete }) => (
  <Card sx={{ mb: 2, cursor: "pointer", position: "relative" }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" onClick={onClick}>
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

export default UserTile;
  