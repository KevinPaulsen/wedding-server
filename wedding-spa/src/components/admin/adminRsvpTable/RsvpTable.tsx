// components/admin/adminRsvpTable/RsvpTable.tsx
import React from 'react';
import {
  Alert,
  Checkbox,
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
import {useEditRsvp} from "../../../hooks/rsvp/useEditRsvp";
import {RsvpTableRow} from "./RsvpTableRow";
import {EnhancedTableToolbar} from "./EnhancedTableToolbar";
import {CreateRsvpDTO} from "../../../types/RsvpDTO";
import CreateRsvpDialog from "./CreateRsvpDialog";

interface RsvpTableProps {
  rsvpData: Rsvp[];
  deleteRsvp: (rsvpCode: string) => Promise<void>;
  deleteError: string | null;
  deleteLoading: boolean;
  createRsvp: (createDTO: CreateRsvpDTO) => Promise<boolean>;
  createError: string | null;
  createLoading: boolean;
  updateRsvpInState: (updatedRsvp: Rsvp) => void;
}

// Columns for main table (with optional responsive hiding)
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
    getValue: (row: Rsvp) => row.guest_list[row.primary_contact.name].display_name,
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
}

const RsvpTable: React.FC<RsvpTableProps> = ({
                                               rsvpData,
                                               deleteRsvp,
                                               deleteError,
                                               deleteLoading,
                                               createRsvp,
                                               createError,
                                               createLoading,
                                               updateRsvpInState
                                             }) => {
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("primaryName");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [editingRsvp, setEditingRsvp] = React.useState<Rsvp | null>(null);
  const [creatingRsvp, setCreatingRsvp] = React.useState<CreateRsvpDTO | null>(null);

  const handleRequestSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const {
    error: updateError,
    loading: updateLoading,
    execute: editRsvpApi
  } = useEditRsvp();

  // This method is passed to <EditRsvpDialog onSave={handleUpdateRsvp} />
  const handleUpdateRsvp = async (updatedRsvp: Rsvp) => {
    const newRsvpData = await editRsvpApi(updatedRsvp);

    // 2) If the API call returned success (no updateError), update local data
    if (newRsvpData.success) {
      updateRsvpInState(newRsvpData.data as Rsvp);
    }

    return newRsvpData;
  };

  const handleCreateRsvp = async (updatedRsvpDto: CreateRsvpDTO) => {
    return await createRsvp(updatedRsvpDto);
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rsvpData.map((n) => n.rsvp_id);
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

    // Using allSettled so each RSVP deletion can succeed/fail independently
    await Promise.allSettled(
        selected.map((rsvpId) => deleteRsvp(rsvpId))
    );

    setSelected([]);
  };

  const comparator = (a: Rsvp, b: Rsvp) => {
    const column = columns.find((col) => col.id === orderBy);
    if (!column) return 0;
    const valueA = column.getValue(a);
    const valueB = column.getValue(b);
    if (typeof valueA === "number" && typeof valueB === "number") {
      return order === "asc" ? valueA - valueB : valueB - valueA;
    }
    return order === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
  };

  const sortedRows = [...rsvpData].sort(comparator);

  return (
      <Paper
          sx={{
            maxWidth: 1200, // Limit width on larger screens
            mx: "auto",
            bgcolor: (theme) => theme.palette.secondary.light,
            p: 2,
          }}
      >
        <EnhancedTableToolbar
            numSelected={selected.length}
            onDelete={handleDelete}
            onAddRsvp={() => setCreatingRsvp(JSON.parse(JSON.stringify(createRsvpDto)))}
            loading={deleteLoading}
        />
        {deleteError && <Alert severity="error">{deleteError}</Alert>}
        {createError && <Alert severity="error">{createError}</Alert>}

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
                          selected.length > 0 && selected.length < rsvpData.length
                      }
                      checked={
                          rsvpData.length > 0 && selected.length === rsvpData.length
                      }
                      onChange={handleSelectAllClick}
                      slotProps={{
                        input: {
                          "aria-label": "select all RSVPs",
                        },
                      }}
                  />
                </TableCell>
                {columns.map((column) => (
                    <TableCell
                        key={column.id}
                        sx={{
                          display: column.hideOnSmall
                              ? {xs: "none", md: "table-cell"}
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
            onSubmit={handleCreateRsvp}
            loading={createLoading}
            error={createError}
        />
        <EditRsvpDialog
            open={Boolean(editingRsvp)}
            rsvp={editingRsvp}
            onClose={() => setEditingRsvp(null)}
            onSave={handleUpdateRsvp}
            loading={updateLoading}
            error={updateError}
        />
      </Paper>
  );
};

export default RsvpTable;
