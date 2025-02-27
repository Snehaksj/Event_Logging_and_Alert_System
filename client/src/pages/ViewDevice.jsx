import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search } from "lucide-react";
import Nav from "../Components/Nav";
import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper();

export default function ViewDevice() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [ipAddressData, setIpAddressData] = useState([]);
  const [ramData, setRamData] = useState([]);
  const [macAddressData, setMacAddressData] = useState([]);
  const [softwareVersionData, setSoftwareVersionData] = useState([]);
  const [sdhData, setSdhData] = useState([]);

  // Fetch device data once when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/devices/all");
        const devices = response.data;

        // Set general device data
        setData(devices);

        // Traverse and extract each part of the configuration
        const ipAddresses = devices.map((device) => device.configuration[0]);
        setIpAddressData(ipAddresses);

        const ramValues = devices.map((device) => device.configuration[1]);
        setRamData(ramValues);

        const macAddresses = devices.map((device) => device.configuration[2]);
        setMacAddressData(macAddresses);

        const softwareVersions = devices.map((device) => device.configuration[3]);
        setSoftwareVersionData(softwareVersions);

        const sdhs = devices.map((device) => device.configuration[4]);
        setSdhData(sdhs);

        console.log(devices); // Log the fetched data for debugging
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    };

    fetchData();  // Fetch data initially
  }, []);  // Empty dependency array to only fetch once when the component is mounted

  // Dynamically create columns
  const columns = [
    columnHelper.accessor("id", {
      header: () => <span className="flex items-center">Device ID</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes", // Make column filterable
    }),
    columnHelper.accessor("name", {
      header: () => <span className="flex items-center">Device Name</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes", // Make column filterable
    }),
    columnHelper.accessor((row) => row.user.username, {
      id: "assignedUser", // Add a unique id for the Assigned User column
      header: () => <span className="flex items-center">Assigned User</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes", // Make column filterable
    }),
    columnHelper.accessor((row) => row.configuration[0], {
      id: "ipAddress", // Add a unique id for this column
      header: () => <span className="flex items-center">IP Address</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes",
    }),
    columnHelper.accessor((row) => row.configuration[1], {
      id: "ram", // Add a unique id for this column
      header: () => <span className="flex items-center">RAM</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes",
    }),
    columnHelper.accessor((row) => row.configuration[2], {
      id: "macAddress", // Add a unique id for this column
      header: () => <span className="flex items-center">MAC Address</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes",
    }),
    columnHelper.accessor((row) => row.configuration[3], {
      id: "softwareVersion", // Add a unique id for this column
      header: () => <span className="flex items-center">Software Version</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes",
    }),
    columnHelper.accessor((row) => row.configuration[4], {
      id: "sdh", // Add a unique id for this column
      header: () => <span className="flex items-center">SDH</span>,
      cell: (info) => info.getValue(),
      filterFn: "includes",
    }),
  ];
  
  
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

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/devices");
  };

  const handleDownload = () => {
  
    

    const filteredData = data.map(({ id, name, user, configuration }) => ({
      "Device ID": id,
      "Device Name": name,
      "Assigned User": user.username,
      "IP Address": configuration[0] || "N/A",
      "RAM": configuration[1] || "N/A",
      "MAC Address": configuration[2] || "N/A",
      "Software Version": configuration[3] || "N/A",
      "SDH": configuration[4] || "N/A",
    }));
  
   
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Devices");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
   
    saveAs(blob, "devices.xlsx");
  };
  

  return (
    <>
      <Nav />
      <p className="m-10 text-white cursor-pointer hover:text-gray-300 w-36" onClick={handleBack}>
        &larr; Back to devices
      </p>
      <div className="flex flex-col w-11/12 max-h-[500px] mt-4 mx-auto p-3 bg-slate-900 text-gray-300 rounded-lg">
        <div className="mb-4 relative">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-indigo-400 focus:border-indigo-400 text-gray-300 bg-slate-900"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
        </div>

        <div className="overflow-y-auto max-h-[500px] bg-slate-900 shadow-md rounded-lg custom-scrollbar">
          <table className="w-full divide-y divide-gray-700 table-auto">
            <thead className="bg-slate-900 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
                      <div
                        {...{
                          className: header.column.getCanSort() ? "cursor-pointer select-none flex items-center" : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                    <td key={cell.id} className="px-2 py-3 whitespace-nowrap text-sm text-gray-300">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        <div className="flex justify-end mt-4 mr-14">
          <button
            onClick={handleDownload}
            class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
          >
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Download
            </span>
          </button>
        </div>
    </>
  );
}
