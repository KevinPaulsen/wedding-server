// RsvpTable.tsx
import React from 'react';
import {
    Alert,
    Box,
    Checkbox,
    Chip,
    CircularProgress,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import {Rsvp} from "../../../types/rsvp";
import EditRsvpDialog from "../adminGalleryControl/EditRsvpDialog";
import {useEditRsvp} from "../../../hooks/rsvp/useEditRsvp";

interface RsvpTableProps {
    rsvpData: Rsvp[];
    deleteRsvp: (rsvpCode: string) => Promise<void>;
    error: string | null;
    updateRsvpInState: (updatedRsvp: Rsvp) => void;
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    onDelete: () => void;
    loading: boolean;
}

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
                                                                       numSelected,
                                                                       onDelete,
                                                                       loading,
                                                                   }) => {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        theme.palette.action.activatedOpacity
                            ? theme.palette.action.activatedOpacity
                            : theme.palette.primary.main,
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    RSVPs
                </Typography>
            )}
            {numSelected > 0 ? (
                loading ? (
                    <CircularProgress size={24} />
                ) : (
                    <Tooltip title="Delete">
                        <IconButton onClick={onDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
};

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

interface CollapsibleRowProps {
    row: Rsvp;
    selected: boolean;
    onSelect: (rsvpId: string) => void;
    onEdit: (row: Rsvp) => void;
}

const CollapsibleRow: React.FC<CollapsibleRowProps> = ({ row, selected, onSelect, onEdit }) => {
    const [open, setOpen] = React.useState<boolean>(false);

    const status =
        !row.submitted
            ? "Pending"
            : Object.values(row.guest_list).some((guest) => guest.coming)
                ? "Coming"
                : "Not Coming";

    const statusChipColor =
        status === "Pending"
            ? "info"
            : status === "Coming"
                ? "success"
                : "error";

    // --- Guest Table Sorting Setup ---
    // Use Object.entries to capture guest key.
    type GuestEntry = [string, typeof row.guest_list[keyof typeof row.guest_list]];
    const guestColumns = [
        {
            id: "guestName",
            label: "Guest Name",
            getValue: (entry: GuestEntry) => entry[1].display_name,
        },
        {
            id: "coming",
            label: "Coming",
            getValue: (entry: GuestEntry) => (entry[1].coming ? "Coming" : "Not Coming"),
        },
        {
            id: "dietary",
            label: "Dietary Restrictions",
            getValue: (entry: GuestEntry) =>
                [...entry[1].dietary_restrictions, entry[1].other].filter(Boolean).join(", "),
        },
        {
            id: "roce",
            label: "Roce",
            getValue: (entry: GuestEntry) => {
                if (row.roce.allowed_guests === 0) return "";
                return row.roce.guests_attending
                    .map((s) => s.toLowerCase())
                    .includes(entry[0].toLowerCase())
                    ? "Yes"
                    : "No";
            },
        },
        {
            id: "rehearsal",
            label: "Rehearsal",
            getValue: (entry: GuestEntry) => {
                if (row.rehearsal.allowed_guests === 0) return "";
                return row.rehearsal.guests_attending
                    .map((s) => s.toLowerCase())
                    .includes(entry[0].toLowerCase())
                    ? "Yes"
                    : "No";
            },
        },
        {
            id: "ceremony",
            label: "Ceremony",
            getValue: (entry: GuestEntry) => {
                if (row.ceremony.allowed_guests === 0) return "";
                return row.ceremony.guests_attending
                    .map((s) => s.toLowerCase())
                    .includes(entry[0].toLowerCase())
                    ? "Yes"
                    : "No";
            },
        },
        {
            id: "reception",
            label: "Reception",
            getValue: (entry: GuestEntry) => {
                if (row.reception.allowed_guests === 0) return "";
                return row.reception.guests_attending
                    .map((s) => s.toLowerCase())
                    .includes(entry[0].toLowerCase())
                    ? "Yes"
                    : "No";
            },
        },
    ];

    const [guestOrder, setGuestOrder] = React.useState<"asc" | "desc">("asc");
    const [guestOrderBy, setGuestOrderBy] = React.useState<string>("guestName");

    const handleGuestRequestSort = (columnId: string) => {
        const isAsc = guestOrderBy === columnId && guestOrder === "asc";
        setGuestOrder(isAsc ? "desc" : "asc");
        setGuestOrderBy(columnId);
    };

    const guestComparator = (a: GuestEntry, b: GuestEntry) => {
        const col = guestColumns.find((col) => col.id === guestOrderBy);
        if (!col) return 0;
        const valueA = col.getValue(a);
        const valueB = col.getValue(b);
        return guestOrder === "asc"
            ? String(valueA).localeCompare(String(valueB))
            : String(valueB).localeCompare(String(valueA));
    };

    const guestEntries = Object.entries(row.guest_list) as GuestEntry[];
    const sortedGuestEntries = [...guestEntries].sort(guestComparator);

    return (
        <>
            <TableRow
                sx={{
                    bgcolor: (theme) => theme.palette.secondary.dark,
                    "& td, & th": {
                        borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                    },
                }}
            >
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={selected}
                        onClick={(event) => {
                            event.stopPropagation();
                            onSelect(row.rsvp_id);
                        }}
                    />
                </TableCell>
                <TableCell
                    sx={{
                        color: (theme) => theme.palette.secondary.contrastText,
                        fontWeight: "bold",
                    }}
                >
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                    {row.guest_list[row.primary_contact.name].display_name}
                </TableCell>
                <TableCell
                    sx={{
                        display: { xs: "none", sm: "table-cell" },
                        color: (theme) => theme.palette.secondary.contrastText,
                    }}
                >
                    {row.primary_contact.email}
                </TableCell>
                <TableCell
                    sx={{
                        display: { xs: "none", sm: "table-cell" },
                        color: (theme) => theme.palette.secondary.contrastText,
                    }}
                >
                    {row.primary_contact.address}
                </TableCell>
                <TableCell
                    sx={{
                        display: { xs: "none", sm: "table-cell" },
                        color: (theme) => theme.palette.secondary.contrastText,
                    }}
                >
                    {row.primary_contact.phone_number}
                </TableCell>
                <TableCell sx={{ color: (theme) => theme.palette.secondary.contrastText }}>
                    {Object.keys(row.guest_list).length}
                </TableCell>
                <TableCell>
                    <Chip label={status} color={statusChipColor} />
                </TableCell>
                <TableCell>
                    <Tooltip title="Edit">
                        <IconButton onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow
                sx={{
                    bgcolor: (theme) => theme.palette.secondary.dark,
                    "& td, & th": {
                        borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
                    },
                }}
            >
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box marginLeft={3}>
                            <Table size="small" aria-label="guest-list">
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            "& th": {
                                                borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
                                            },
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {guestColumns.map((column) => (
                                            <TableCell key={column.id}>
                                                <TableSortLabel
                                                    active={guestOrderBy === column.id}
                                                    direction={guestOrderBy === column.id ? guestOrder : "asc"}
                                                    onClick={() => handleGuestRequestSort(column.id)}
                                                >
                                                    {column.label}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedGuestEntries.map((entry, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                "& td, & th": {
                                                    borderBottom: (theme) =>
                                                        `1px solid ${theme.palette.primary.main}`,
                                                },
                                            }}
                                        >
                                            {guestColumns.map((column) => {
                                                const value = column.getValue(entry);
                                                if (
                                                    column.id === "roce" ||
                                                    column.id === "rehearsal" ||
                                                    column.id === "ceremony" ||
                                                    column.id === "reception"
                                                ) {
                                                    return (
                                                        <TableCell key={column.id}>
                                                            {value === "" ? null : (
                                                                <Chip
                                                                    label={value}
                                                                    color={value === "Yes" ? "success" : "error"}
                                                                    size="small"
                                                                />
                                                            )}
                                                        </TableCell>
                                                    );
                                                }
                                                if (column.id === "coming") {
                                                    return (
                                                        <TableCell key={column.id}>
                                                            <Chip
                                                                label={value}
                                                                color={value === "Coming" ? "success" : "error"}
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                    );
                                                }
                                                if (column.id === "dietary") {
                                                    return (
                                                        <TableCell key={column.id}>
                                                            {[
                                                                ...entry[1].dietary_restrictions,
                                                                ...(entry[1].other ? [entry[1].other] : []),
                                                            ].map((restriction, i) => (
                                                                <Chip
                                                                    key={i}
                                                                    label={restriction}
                                                                    sx={{ m: 0.5 }}
                                                                    size="small"
                                                                />
                                                            ))}
                                                        </TableCell>
                                                    );
                                                }
                                                return (
                                                    <TableCell key={column.id}>{value}</TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const RsvpTable: React.FC<RsvpTableProps> = ({ rsvpData, deleteRsvp, error, updateRsvpInState }) => {
    const [order, setOrder] = React.useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = React.useState<string>("primaryName");
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
    const [deleteError, setDeleteError] = React.useState<string | null>(null);
    const [editingRsvp, setEditingRsvp] = React.useState<Rsvp | null>(null);

    const handleRequestSort = (columnId: string) => {
        const isAsc = orderBy === columnId && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(columnId);
    };

    const {
        data: updatedData,
        error: updateError,
        loading: updateLoading,
        execute: editRsvpApi
    } = useEditRsvp();

    // This method is passed to <EditRsvpDialog onSave={handleUpdateRsvp} />
    const handleUpdateRsvp = async (updatedRsvp: Rsvp) => {
        // 1) Call the server
        await editRsvpApi(updatedRsvp);

        // 2) If the API call returned success, update local data:
        if (!updateError) {
            updateRsvpInState(updatedRsvp);
        } else {
            // If there's an error, you can throw or handle it differently
            throw new Error(updateError);
        }
    };

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
        setDeleteLoading(true);
        setDeleteError(null);
        try {
            for (const rsvpId of selected) {
                await deleteRsvp(rsvpId);
            }
            setSelected([]);
        } catch (err: any) {
            setDeleteError(err.message || "Failed to delete selected RSVPs.");
        } finally {
            setDeleteLoading(false);
        }
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
                maxWidth: 1200,
                mx: "auto",
                bgcolor: (theme) => theme.palette.secondary.light,
                p: 2,
            }}
        >
            <EnhancedTableToolbar
                numSelected={selected.length}
                onDelete={handleDelete}
                loading={deleteLoading}
            />
            {deleteError && <Alert severity="error">{deleteError}</Alert>}
            <TableContainer>
                <Table size="small" aria-label="collapsible table">
                    <TableHead>
                        <TableRow
                            sx={{
                                "& th": {
                                    borderBottom: (theme) => `2px solid ${theme.palette.primary.main}`,
                                    fontWeight: "bold",
                                },
                            }}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={selected.length > 0 && selected.length < rsvpData.length}
                                    checked={rsvpData.length > 0 && selected.length === rsvpData.length}
                                    onChange={handleSelectAllClick}
                                    inputProps={{
                                        "aria-label": "select all RSVPs",
                                    }}
                                />
                            </TableCell>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    sx={{
                                        display: column.hideOnSmall ? { xs: "none", sm: "table-cell" } : "table-cell",
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
                            <CollapsibleRow
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
            <EditRsvpDialog
                open={Boolean(editingRsvp)}
                rsvp={editingRsvp}
                onClose={() => setEditingRsvp(null)}
                onSave={handleUpdateRsvp}  // real server update
                loading={updateLoading}
                error={updateError}
            />
        </Paper>
    );
};

export default RsvpTable;
