import { Rsvp } from "../../../types/rsvp";
import React from "react";
import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";

interface CollapsibleRowProps {
  row: Rsvp;
  selected: boolean;
  onSelect: (rsvpId: string) => void;
  onEdit: (row: Rsvp) => void;
}

export const RsvpTableRow: React.FC<CollapsibleRowProps> = ({
                                                              row,
                                                              selected,
                                                              onSelect,
                                                              onEdit,
                                                            }) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const status =
      !row.submitted
          ? "Pending"
          : Object.values(row.guest_list).some((guest) => guest.coming)
              ? "Coming"
              : "Not Coming";

  const statusChipColor =
      status === "Pending" ? "info" : status === "Coming" ? "success" : "error";

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
      getValue: (entry: GuestEntry) =>
          entry[1].coming ? "Coming" : "Not Coming",
    },
    {
      id: "dietary",
      label: "Dietary Restrictions",
      getValue: (entry: GuestEntry) =>
          [...entry[1].dietary_restrictions, entry[1].other]
          .filter(Boolean)
          .join(", "),
    },
    {
      id: "roce",
      label: "Roce",
      getValue: (entry: GuestEntry) => {
        if (!row.roce.invited) return "";
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
        if (!row.rehearsal.invited) return "";
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
        if (!row.ceremony.invited) return "";
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
        if (!row.reception.invited) return "";
        return row.reception.guests_attending
        .map((s) => s.toLowerCase())
        .includes(entry[0].toLowerCase())
            ? "Yes"
            : "No";
      },
    },
  ];

  // Filter out event columns that are not allowed.
  const filteredGuestColumns = guestColumns.filter((column) => {
    if (column.id === "roce") return row.roce.invited;
    if (column.id === "rehearsal") return row.rehearsal.invited;
    if (column.id === "ceremony") return row.ceremony.invited;
    if (column.id === "reception") return row.reception.invited;
    return true;
  });

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
          <TableCell>
            <Box
                sx={{
                  color: (theme) => theme.palette.secondary.contrastText,
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "left",
                }}
            >
              <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
              <Box
                  sx={{
                    maxWidth: 200,
                    whiteSpace: "normal", // Allow wrapping at white space
                    wordBreak: "normal", // Do not break words arbitrarily
                    overflowWrap: "normal", // Ensures wrapping happens only at natural break points
                  }}
              >
                {row.guest_list[row.primary_contact.name].display_name}
              </Box>
            </Box>
          </TableCell>
          <TableCell
              sx={{
                display: { xs: "none", md: "table-cell" },
                color: (theme) => theme.palette.secondary.contrastText,
              }}
          >
            {row.last_submission_time
                ? new Date(row.last_submission_time).toLocaleString("en-US", {
                  timeZone: "America/Los_Angeles",
                }) : ""}
          </TableCell>
          <TableCell
              sx={{
                display: { xs: "none", md: "table-cell" },
                color: (theme) => theme.palette.secondary.contrastText,
              }}
          >
            {row.primary_contact.email}
          </TableCell>
          <TableCell
              sx={{
                display: { xs: "none", md: "table-cell" },
                color: (theme) => theme.palette.secondary.contrastText,
              }}
          >
            {row.primary_contact.address}
          </TableCell>
          <TableCell
              sx={{
                display: { xs: "none", md: "table-cell" },
                color: (theme) => theme.palette.secondary.contrastText,
              }}
          >
            {row.primary_contact.phone_number}
          </TableCell>
          <TableCell
              sx={{
                display: { xs: "none", md: "table-cell" },
                color: (theme) => theme.palette.secondary.contrastText,
              }}
          >
            {Object.keys(row.guest_list).length}
          </TableCell>
          <TableCell>
            <Chip label={status} color={statusChipColor} />
          </TableCell>
          <TableCell>
            <Tooltip title="Edit">
              <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row);
                  }}
              >
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
          <TableCell
              style={{ paddingBottom: 0, paddingTop: 0 }}
              colSpan={9}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box marginLeft={3}>
                <Table size="small" aria-label="guest-list">
                  <TableHead>
                    <TableRow
                        sx={{
                          "& th": {
                            borderBottom: (theme) =>
                                `2px solid ${theme.palette.primary.main}`,
                          },
                          fontWeight: "bold",
                        }}
                    >
                      {filteredGuestColumns.map((column) => (
                          <TableCell key={column.id}>
                            <TableSortLabel
                                active={guestOrderBy === column.id}
                                direction={
                                  guestOrderBy === column.id ? guestOrder : "asc"
                                }
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
                          {filteredGuestColumns.map((column) => {
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
                            return <TableCell key={column.id}>{value}</TableCell>;
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
