import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Rating,
} from '@mui/material';
import { BrewWithID } from '../../common/models';
import PageviewIcon from '@mui/icons-material/Pageview';

interface BrewListItemProps {
  brew: BrewWithID;
  onClick: VoidFunction;
}

const BrewListItem = ({ brew, onClick }: BrewListItemProps) => {
  return (
    <ListItem disableGutters>
      <ListItemButton onClick={onClick}>
        <ListItemText
          primary={brew.coffee}
          secondary={brew.date.toDate().toLocaleString([], {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
        <Rating
          readOnly
          value={brew.rating}
          size="small"
          sx={{ marginRight: 0.5 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default BrewListItem;
