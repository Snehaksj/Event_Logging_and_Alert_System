import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,  // Ensure we use the correct filtered row model
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search } from "lucide-react";
import Nav from "../Components/Nav";
import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => <span className="flex items-center">User ID</span>,
    cell: (info) => info.getValue(),
    filterFn: 'includes', // Make column filterable
  }),
  columnHelper.accessor("username", {
    header: () => <span className="flex items-center">Username</span>,
    cell: (info) => info.getValue(),
    filterFn: 'includes', // Make column filterable
  }),
  columnHelper.accessor("role", {
    header: () => <span className="flex items-center">Role</span>,
    cell: (info) => info.getValue(),
    filterFn: 'includes', // Make column filterable
  }),
];

export default function ViewUser() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Fetch data once when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users");
        setData(response.data); // Set the data for the users
        console.log(response.data); // Log the fetched data for debugging
      } catch (error) {
        console.log(error);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();  // Fetch data initially
  }, []);  // Empty dependency array to only fetch once when the component is mounted

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination: { pageIndex, pageSize } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Ensure this is added to enable filtering
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: ({ pageIndex, pageSize }) => {
      setPageIndex(pageIndex);
      setPageSize(pageSize);
    },
  });
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/users'); // Navigate back to the /users page
  };
  return (
    <>
      <Nav/>
      <p className='m-10 text-white cursor-pointer hover:text-gray-300 w-28' onClick={handleBack}> &larr; Back to users</p>
      <div className="flex flex-col w-11/12 max-h-[500px] mt-4 mx-auto p-3 bg-slate-900 text-gray-300 rounded-lg">
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

        {/* Table container with dynamic height and scroll */}
        <div className="overflow-y-auto max-h-[500px] bg-slate-900 shadow-md rounded-lg custom-scrollbar">
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
