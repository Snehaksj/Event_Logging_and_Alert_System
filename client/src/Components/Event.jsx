import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search } from "lucide-react";

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
  columnHelper.accessor("ipAddress", {
    header: () => <span className="flex items-center">IP ADDRESS</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("severity", {
    header: () => <span className="flex items-center">Severity</span>,
    cell: (info) => {
      const value = info.getValue().toUpperCase();
      let colorClass = "text-gray-300";
      if (value === "CRITICAL") {
        colorClass = "text-red-500";
      } else if (value === "MAJOR") {
        colorClass = "text-red-400";
      } else if (value === "WARNING") {
        colorClass = "text-yellow-400";
      } else if (value === "INFO") {
        colorClass = "text-blue-300";
      } else if (value === "MINOR") {
        colorClass = "text-red-200";
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
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Fetch data every 7 seconds using axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/alert");
        setData(response.data); // Set the data first
        console.log(response.data); // Log the response data after setting
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();  // Fetch data initially
    const intervalId = setInterval(fetchData, 5000);  // Fetch data every 7 seconds
  
    return () => clearInterval(intervalId);  // Clean up interval on component unmount
  }, []);
  

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
      <h4 className="pl-1 text-gray-400 text-lg" style={{ textShadow: '0px 0px 30px rgb(29, 120, 248)' }}>
        Event Logs
      </h4>
      <div className="flex flex-col w-full h-[500px] mx-auto p-3 bg-slate-900 text-gray-300 rounded-lg">
        {/* Dark-themed search bar */}
        <div className="mb-4 relative">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400 text-gray-300 bg-slate-900"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
        </div>

        {/* Table container with custom scrollbar */}
        <div className="overflow-x-auto bg-slate-900 shadow-md rounded-lg custom-scrollbar">
          <table className="w-full divide-y divide-gray-700 table-auto">
            <thead className="bg-slate-900 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
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
                      className="px-2 py-3 whitespace-nowrap text-sm text-gray-300"
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
