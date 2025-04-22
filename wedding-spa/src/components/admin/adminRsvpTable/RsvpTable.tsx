import React from 'react';
import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import {Rsvp} from "../../../types/rsvp";
import EditRsvpDialog from "./EditRsvpDialog";
import {RsvpTableRow} from "./RsvpTableRow";
import {EnhancedTableToolbar} from "./EnhancedTableToolbar";
import {CreateRsvpDTO} from "../../../types/RsvpDTO";
import CreateRsvpDialog from "./CreateRsvpDialog";
import CreateBatchRsvpDialog from "./CreateBatchRsvpDialog";
import {useAdminData} from "../../../context/AdminDataContext";

interface ColumnConfig {
  id: string;
  label: string;
  getValue: (row: Rsvp) => any;
  hideOnSmall?: boolean;
}

const columns: ColumnConfig[] = [
  {
    id: "primaryName",
    label: "Primary Contact Name",
    getValue: (row: Rsvp) =>
        row.guest_list[row.primary_contact.name].display_name,
  },
  {
    id: "last_submission_time",
    label: "Last Submitted",
    getValue: (row: Rsvp) =>
        row.last_submission_time
            ? new Date(row.last_submission_time).toLocaleString()
            : "N/A",
    hideOnSmall: true,
  },
  {
    id: "email",
    label: "Email",
    getValue: (row: Rsvp) => row.primary_contact.email,
    hideOnSmall: true,
  },
  {
    id: "address",
    label: "Address",
    getValue: (row: Rsvp) => row.primary_contact.address,
    hideOnSmall: true,
  },
  {
    id: "phone",
    label: "Phone Number",
    getValue: (row: Rsvp) => row.primary_contact.phone_number,
    hideOnSmall: true,
  },
  {
    id: "guestsInvited",
    label: "Guests Invited",
    getValue: (row: Rsvp) => Object.keys(row.guest_list).length,
    hideOnSmall: true,
  },
  {
    id: "status",
    label: "Status",
    getValue: (row: Rsvp) =>
        !row.submitted
            ? "Pending"
            : Object.values(row.guest_list).some((guest) => guest.coming)
                ? "Coming"
                : "Not Coming",
  },
];

const createRsvpDto: CreateRsvpDTO = {
  primary_name: '',
  phone_number: '',
  email: '',
  address: '',
  allowed_guests: [],
  roce_invitation: false,
  rehearsal_invitation: false,
  ceremony_invitation: false,
  reception_invitation: false,
};

const RsvpTable: React.FC = () => {
  // Use centralized admin context with individual states for each action.
  const {
    data,
    loading,
    error,
    deleteRsvp,
  } = useAdminData();

  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("primaryName");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [editingRsvp, setEditingRsvp] = React.useState<Rsvp | null>(null);
  const [creatingRsvp, setCreatingRsvp] =
      React.useState<CreateRsvpDTO | null>(null);
  const [batchDialogOpen, setBatchDialogOpen] = React.useState(false);

  const handleRequestSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const handleSelectAllClick = (
      event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.rsvp_id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (rsvpId: string) => {
    const selectedIndex = selected.indexOf(rsvpId);
    let newSelected: readonly string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, rsvpId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (rsvpId: string) => selected.indexOf(rsvpId) !== -1;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the selected RSVPs?")) {
      return;
    }
    await Promise.allSettled(selected.map((rsvpId) => deleteRsvp(rsvpId)));
    setSelected([]);
  };

  // inside your RsvpTable component, replace the old comparator with:

  const comparator = (a: Rsvp, b: Rsvp): number => {
    const col = columns.find(c => c.id === orderBy);
    if (!col) return 0;

    // For the date column, pull out a raw timestamp; otherwise use getValue()
    let valueA: any, valueB: any;
    if (orderBy === 'last_submission_time') {
      valueA = a.last_submission_time
          ? new Date(a.last_submission_time).getTime()
          : null;
      valueB = b.last_submission_time
          ? new Date(b.last_submission_time).getTime()
          : null;
    } else {
      valueA = col.getValue(a);
      valueB = col.getValue(b);
    }

    // Treat null/undefined/empty/'N/A' as “empty”
    const isEmpty = (v: any) =>
        v === null ||
        v === undefined ||
        v === '' ||
        (typeof v === 'string' && v.toUpperCase() === 'N/A');

    // If both empty, they’re equal
    if (isEmpty(valueA) && isEmpty(valueB)) return 0;
    // Empty always comes last:
    if (isEmpty(valueA)) return 1;
    if (isEmpty(valueB)) return -1;

    // Now both are non‐empty:
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return order === 'asc'
          ? valueA - valueB
          : valueB - valueA;
    }

    // Fallback to string compare
    const strA = String(valueA);
    const strB = String(valueB);
    return order === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
  };

  const [sortedRows, setSortedRows] = React.useState<Rsvp[]>(() => {
    return [...data].sort(comparator);
  });

  React.useEffect(() => {
    setSortedRows([...data].sort(comparator));
  }, [data]);

  React.useEffect(() => {
    setSortedRows((prevSorted) => [...prevSorted].sort(comparator));
  }, [order, orderBy]);

  const handleBatchAdd = () => {
    setBatchDialogOpen(true);
  };

  return (
      <Paper
          sx={{
            width: "100%",
            maxWidth: 1100,
            mx: 5,
            bgcolor: (theme) => theme.palette.secondary.light,
            p: 2,
          }}
      >
        <EnhancedTableToolbar
            numSelected={selected.length}
            onDelete={handleDelete}
            onAddRsvp={() =>
                setCreatingRsvp(JSON.parse(JSON.stringify(createRsvpDto)))
            }
            onBatchAdd={handleBatchAdd}
        />

        <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          {loading && <CircularProgress />}
        </Box>

        <TableContainer>
          <Table size="small" aria-label="collapsible table">
            <TableHead>
              <TableRow
                  sx={{
                    "& th": {
                      borderBottom: (theme) =>
                          `2px solid ${theme.palette.primary.main}`,
                      fontWeight: "bold",
                    },
                  }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                      color="primary"
                      indeterminate={
                          selected.length > 0 && selected.length < data.length
                      }
                      checked={data.length > 0 && selected.length === data.length}
                      onChange={handleSelectAllClick}
                      slotProps={{
                        input: { "aria-label": "select all RSVPs" },
                      }}
                  />
                </TableCell>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        sx={{
                          display: column.hideOnSmall
                              ? { xs: "none", md: "table-cell" }
                              : "table-cell",
                        }}
                    >
                      <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : "asc"}
                          onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows.map((row) => (
                  <RsvpTableRow
                      key={row.rsvp_id}
                      row={row}
                      selected={isSelected(row.rsvp_id)}
                      onSelect={handleSelectClick}
                      onEdit={(row) => setEditingRsvp(row)}
                  />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <CreateRsvpDialog
            open={Boolean(creatingRsvp)}
            rsvp={creatingRsvp}
            onClose={() => setCreatingRsvp(null)}
        />
        <EditRsvpDialog
            open={Boolean(editingRsvp)}
            rsvp={editingRsvp}
            onClose={() => setEditingRsvp(null)}
        />
        <CreateBatchRsvpDialog
            open={batchDialogOpen}
            onClose={() => setBatchDialogOpen(false)}
        />
      </Paper>
  );
};

export default RsvpTable;
