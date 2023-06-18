import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { Brew } from '../../common/models';

interface BrewDetailsDialogProps {
  open: boolean;
  onClose: VoidFunction;
  brew: Brew | undefined;
  onBrewRepeat: VoidFunction;
}

const BrewDetailsDialog = ({
  open,
  onClose,
  brew,
  onBrewRepeat,
}: BrewDetailsDialogProps) => {
  return brew ? (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h4">
        {brew.coffee} | {brew.brewMethod}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {brew.date.toDate().toLocaleString([], {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </DialogContentText>

        <Rating readOnly value={brew.rating} />

        <Stack py={1} direction="row" spacing={1}>
          {brew.tags.map((tag) => (
            <Chip label={tag} />
          ))}
        </Stack>

        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell component="th">Amount of coffee</TableCell>
              <TableCell>{brew.coffeeAmount} g</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Grind Setting</TableCell>
              <TableCell>{brew.grindSetting}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Water Amount</TableCell>
              <TableCell>{brew.waterAmount} g</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Temperature</TableCell>
              <TableCell>{brew.temperature} &#176;C</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th">Brew Time</TableCell>
              <TableCell>{brew.brewTime} s</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <DialogContentText paddingTop={2}>{brew.notes}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onBrewRepeat}>Repeat Brew</Button>
      </DialogActions>
    </Dialog>
  ) : null;
};

export default BrewDetailsDialog;
