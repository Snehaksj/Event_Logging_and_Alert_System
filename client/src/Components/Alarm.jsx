import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("deviceId", {
    header: () => <span className="flex items-center">Device ID</span>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("message", {
    header: () => <span className="flex items-center">Message</span>,
    cell: (info) => info.getValue(),
  }),
];

export default function Alarm() {
  const [data, setData] = useState([]); // State to hold the data
  const [sorting, setSorting] = useState([]); // Sorting state

  // Fetch data from the endpoint on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/alert/critical");
        setData(response.data); // Set the fetched data
        console.log(response.data); // Log the response data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Fetch data initially

    // Optionally, you can add an interval for periodic fetching:
    const intervalId = setInterval(fetchData, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
  });

  return (
    <>
      <h4 className="p-1 text-lg text-gray-400">Critical Alarm Logs</h4>
      <div
        className="flex flex-col w-full mx-auto p-3 rounded-lg"
        style={{
          background: "rgba(60,11,194,1)",
        }}
      >
        {/* Table container with max height and scroll */}
        <div className="overflow-y-auto max-h-[300px] rounded-lg custom-scrollbar">
          <table className="w-full divide-y divide-gray-100 sticky">
            <thead className="sticky top-0 z-10" style={{ background: "rgba(60,11,194,1)" }}>
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
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-blue-900">
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
