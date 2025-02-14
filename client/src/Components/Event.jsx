import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import eventData from "../data/data.json"; // adjust path as needed

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("eventId", {
    header: () => <span className="flex items-center">Event ID</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("timestamp", {
    header: () => <span className="flex items-center">Timestamp</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("deviceId", {
    header: () => <span className="flex items-center">Device ID</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("eventType", {
    header: () => <span className="flex items-center">Event Type</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.metadata?.ip || "", {
    id: "ipAddress",
    header: () => <span className="flex items-center">IP Address</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("severity", {
    header: () => <span className="flex items-center">Severity</span>,
    cell: (info) => {
      const value = info.getValue().toUpperCase();
      let colorClass = "text-gray-300";
      if (value === "CRITICAL") {
        colorClass = "text-red-500";
      } else if (value === "ERROR") {
        colorClass = "text-red-400";
      } else if (value === "WARN") {
        colorClass = "text-yellow-400";
      } else if (value === "INFO") {
        colorClass = "text-blue-300";
      } else if (value === "NOTICE") {
        colorClass = "text-green-400";
      }
      return <span className={colorClass}>{info.getValue()}</span>;
    },
  }),
  columnHelper.accessor("message", {
    header: () => <span className="flex items-center">Message</span>,
    cell: (info) => info.getValue(),
  }),
];

export default function Event() {
  const [data] = React.useState(() => [...eventData]);
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageIndex, setPageIndex] = React.useState(0); // Page index state
  const [pageSize, setPageSize] = React.useState(5); // Page size state

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination: { pageIndex, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: ({ pageIndex, pageSize }) => {
      setPageIndex(pageIndex);
      setPageSize(pageSize);
    },
  });

  return (
    <>
      <h4 className="p-1 text-lg">Event Logs</h4>
      <div className="flex flex-col w-full h-[400px] mx-auto p-3 bg-gray-900 text-gray-300 rounded-lg">
        {/* Dark-themed search bar */}
        <div className="mb-4 relative">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400 text-gray-300"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
        </div>

        {/* Table container with dark grey background, rounded borders, and scrollable */}
        <div className="overflow-y-auto bg-gray-800 shadow-md rounded-lg">
          <table className="w-full divide-y divide-gray-700">
            <thead className="bg-gray-700 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown className="ml-2" size={14} />
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-700">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-600">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 whitespace-nowrap text-sm text-gray-300"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
