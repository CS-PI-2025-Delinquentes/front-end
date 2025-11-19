import { ButtonText, SectionApp, AppHeader } from "@/components";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "phosphor-react";
import { useIsMobile } from "@/hooks/use-mobile";
import RouteService from "../../../services/RouteService";
import { toast, Toaster } from "sonner";

export function ServicedRoutes() {
  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Rotas atendidas" />
        <RoutesDataTable />
        <Toaster position="top-right" richColors />
      </SectionApp>
    </>
  );
}

const getColumns = () => [
  {
    accessorKey: "cidade",
    header: "Cidade",
    cell: ({ row }) => <div className="capitalize">{row.getValue("cidade")}</div>,
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => <div className="capitalize">{row.getValue("estado")}</div>,
  },
];

function RoutesDataTable() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setColumnVisibility({
      estado: !isMobile,
    });
  }, [isMobile]);

  const routeService = React.useMemo(() => new RouteService(), []);

  const loadRoutes = React.useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await routeService.findAll(page);
      if (response.data) {
        setCurrentPage(response.data.number || 0);
        setTotalPages(response.data.totalPages || 1);

        const mappedData = response.data.content.map(route => ({
          id: route.id,
          cidade: route.nome,
          estado: route.estado?.uf || "Paraná",
        }));

        setTableData(mappedData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Erro ao carregar rotas:", error);
      toast.error("Erro ao carregar rotas");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [routeService]);

  useEffect(() => {
    loadRoutes(0);
  }, [loadRoutes]);

  const columns = getColumns();

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting: [
        {
          id: "cidade",
          desc: false,
        },
      ],
      manualPagination: true,
      pageCount: totalPages,
    },
  });

  return (
    <div className="w-full pt-5">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-center font-bold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-center"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loading ? "Carregando..." : "Nenhuma cidade atendida no momento."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const prev = Math.max(0, currentPage - 1);
              loadRoutes(prev);
            }}
            disabled={currentPage <= 0}
          >
            <ArrowLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const next = Math.min(totalPages - 1, currentPage + 1);
              loadRoutes(next);
            }}
            disabled={currentPage >= totalPages - 1}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}