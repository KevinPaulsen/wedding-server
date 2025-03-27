// components/admin/adminGuestTable/GuestTable.tsx
import React, {useState} from 'react';
import {AggregatedGuest, EventType} from './AdminGuestController';
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  useTheme,
} from "@mui/material";

interface GuestTableProps {
  guests: AggregatedGuest[];
  selectedEvent: EventType;
}

interface ColumnConfig {
  id: string;
  label: string;
  getValue: (guest: AggregatedGuest) => any;
  align?: "left" | "center" | "right";
}

const GuestTable: React.FC<GuestTableProps> = ({ guests, selectedEvent }) => {
  const theme = useTheme();

  // Define common columns.
  // The dietary column now aggregates both the dietary restrictions and any "other" value.
  let columns: ColumnConfig[] = [
    { id: "name", label: "Guest Name", getValue: (g) => g.name },
    {
      id: "dietary",
      label: "Dietary Restrictions",
      getValue: (g) => [...g.dietaryRestrictions, ...(g.other ? [g.other] : [])],
    },
  ];

  if (selectedEvent === "all") {
    // When "All" is selected, show a separate column for each event.
    columns = columns.concat([
      { id: "roce", label: "Roce", getValue: (g) => g.events.roce },
      { id: "rehearsal", label: "Rehearsal", getValue: (g) => g.events.rehearsal },
      { id: "ceremony", label: "Ceremony", getValue: (g) => g.events.ceremony },
      { id: "reception", label: "Reception", getValue: (g) => g.events.reception },
    ]);
  } else {
    // Otherwise, show a single "Status" column for the selected event.
    columns.push({ id: "status", label: "Status", getValue: (g) => g.events[selectedEvent] });
  }

  // Sorting state.
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("name");

  const handleRequestSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const comparator = (a: AggregatedGuest, b: AggregatedGuest) => {
    const col = columns.find(col => col.id === orderBy);
    if (!col) return 0;
    const valueA = col.getValue(a);
    const valueB = col.getValue(b);
    return order === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
  };

  // Instead of using useMemo to sort from scratch, we initialize sortedRows in state.
  const [sortedRows, setSortedRows] = React.useState<AggregatedGuest[]>(() => {
    return [...guests].sort(comparator);
  });

  // When rsvpData changes, reinitialize the sorted list.
  React.useEffect(() => {
    setSortedRows([...guests].sort(comparator));
  }, [guests]);

  // When sort parameters change, re-sort the previously sorted list.
  React.useEffect(() => {
    setSortedRows((prevSorted) => [...prevSorted].sort(comparator));
  }, [order, orderBy]);

  // Helper to render a status pill using Chip.
  const renderStatusPill = (status: 'Coming' | 'Not Coming' | 'Pending' | null) => {
    if (!status) return null;
    let color: "success" | "error" | "info" = "info";
    if (status === "Coming") color = "success";
    else if (status === "Not Coming") color = "error";
    return <Chip label={status} color={color} size="small" />;
  };

  return (
      <TableContainer component={Paper} sx={{ bgcolor: theme.palette.secondary.dark }}>
        <Table size="small" aria-label="guest table">
          <TableHead>
            <TableRow
                sx={{
                  "& th": {
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    fontWeight: "bold",
                  },
                }}
            >
              {columns.map(column => (
                  <TableCell key={column.id} align={column.align || "left"}>
                    <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((guest, index) => (
                <TableRow
                    key={`${guest.rsvpId}-${guest.guestId}-${index}`}
                    sx={{
                      "& td": { borderBottom: `1px solid ${theme.palette.primary.main}` },
                    }}
                >
                  {columns.map(column => {
                    const value = column.getValue(guest);
                    // For event columns and status, render the status pill.
                    if (
                        column.id === "roce" ||
                        column.id === "rehearsal" ||
                        column.id === "ceremony" ||
                        column.id === "reception" ||
                        column.id === "status"
                    ) {
                      return (
                          <TableCell key={column.id} align={column.align || "left"}>
                            {renderStatusPill(value)}
                          </TableCell>
                      );
                    }
                    // For dietary restrictions, render each as a Chip.
                    if (column.id === "dietary") {
                      return (
                          <TableCell key={column.id} align={column.align || "left"}>
                            {Array.isArray(value) && value.length > 0
                                ? value.map((restriction: string, i: number) => (
                                    <Chip key={i} label={restriction} size="small" sx={{ m: 0.5 }} />
                                ))
                                : "-"}
                          </TableCell>
                      );
                    }
                    return (
                        <TableCell key={column.id} align={column.align || "left"}>
                          {value}
                        </TableCell>
                    );
                  })}
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
};

export default GuestTable;
