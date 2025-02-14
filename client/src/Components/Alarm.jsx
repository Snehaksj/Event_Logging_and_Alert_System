import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import eventData from "../data/data.json"; // adjust path as needed

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
  const [data] = React.useState(() =>
    eventData.filter((log) => log.severity === "CRITICAL") // Only include critical logs
  );
  const [sorting, setSorting] = React.useState([]); // Sorting state

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
      <h4 className="p-1 text-lg text-gray-500">Critical Alarm Logs</h4>
      <div
        className="flex flex-col w-full max-h-[400px] mx-auto p-3 rounded-lg"
        style={{
          
          background: "linear-gradient(90deg,rgba(60,11,194,1) 0%, rgba(54,12,176,1) 59%, rgba(116,27,210,1) 100%)"
        }}
      >
        {/* Table container with custom scrollbar */}
        <div className="overflow-y-auto  rounded-lg custom-scrollbar">
          <table className="w-full divide-y divide-gray-100">
            <thead className=" sticky top-0 z-10">
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
                <tr key={row.id} className="hover:bg-">
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
