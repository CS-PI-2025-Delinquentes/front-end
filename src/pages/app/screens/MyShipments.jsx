import { SectionApp, AppHeader, Modal, ModalConfirm } from "@/components";
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

import { Button } from "@/components/ui/button"
import { X, ArrowLeft, ArrowRight } from "phosphor-react";
import { useIsMobile } from "@/hooks/use-mobile"
import BudgetService from "../../../services/BudgetService";

export function MyShipments() {
  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Solicitações" />
        <DataTableDemo />
        <Modal status={false} />
      </SectionApp>
    </>
  );
}

const getColumns = ({ onCancelClick, currentPage = 0 }) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.index + 1 + (currentPage * 10)}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Data",
    sortingFn: (rowA, rowB, columnId) => {
      function parseDate(dateString) {
        const parts = dateString.split("/");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        return new Date(year, month, day);
      }
      rowA = parseDate(rowA.getValue(columnId))
      rowB = parseDate(rowB.getValue(columnId))
      return rowA > rowB ? 1 : rowA < rowB ? -1 : 0
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "Origem/Destino",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.origin}/{row.original.destination}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const formattedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';
      return (
        <div>{formattedStatus}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Cancelar",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const isPending = status && status.toLowerCase() === 'pendente';

      return (
        <Button
          variant="secondary"
          className={`h-8 w-8 p-0 ${isPending ? 'hover:cursor-pointer' : 'text-gray-400 cursor-not-allowed opacity-50'}`}
          onClick={() => {
            if (isPending) {
              onCancelClick(row.original);
            }
          }}
          disabled={!isPending}
        >
          <X />
        </Button>
      );
    },
  },
];

function DataTableDemo() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [tableData, setTableData] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const budgetService = new BudgetService();
  const isMobile = useIsMobile();

  const formatDate = (dateArray) => {
    if (!dateArray) return "";
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const loadShipments = async (page) => {
    setLoading(true);
    try {
      const response = await budgetService.findAllClient(page);
      const shipments = response.data.content || [];
      setTotalPages(response.data.totalPages);

      const formattedData = shipments.map((shipment) => ({
        id: shipment.id,
        date: formatDate(shipment.dataPedido),
        origin: shipment.origem,
        destination: shipment.destino,
        status: shipment.status,
      }));

      setTableData(formattedData);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadShipments(currentPage);
  }, [currentPage]);

  React.useEffect(() => {
    setColumnVisibility({
      id: !isMobile,
      origem: !isMobile,
      destino: false,
    });
  }, [isMobile]);

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const columns = React.useMemo(() => getColumns({
    onCancelClick: setSelectedRow,
    currentPage
  }), [currentPage]);

  const handleCancel = async () => {
    if (!selectedRow) return;

    try {
      await budgetService.deleteClient(selectedRow.id);
      await loadShipments(currentPage);
    } catch (error) {
      console.error("Erro ao cancelar solicitação:", error);
    } finally {
      setSelectedRow(null);
    }
  };

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting,
      pagination: {
        pageIndex: currentPage,
        pageSize: 10,
      },
    },
    initialState: {
      sorting: [
        {
          id: 'data',
          desc: true,
        },
      ],
    },
  });

  if (loading) {
    return (
      <div className="w-full pt-5">
        <div className="text-center text-gray-600">
          Carregando solicitações...
        </div>
      </div>
    );
  }

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
                <TableRow className="text-center"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  Nenhuma solicitação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação customizada */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="disabled:opacity-50 disabled:pointer-events-none w-auto"
            variant="outline"
          >
            <ArrowLeft className="icon" />
          </Button>
          <span className="text-sm text-gray-600 mx-2">
            {currentPage + 1} de {totalPages}
          </span>
          <Button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="disabled:opacity-50 disabled:pointer-events-none w-auto"
            variant="outline"
          >
            <ArrowRight className="icon" />
          </Button>
        </div>
      )}

      <ModalConfirm
        message="Você realmente deseja cancelar esta solicitação?"
        open={!!selectedRow}
        options={["Não", "Sim"]}
        action={() => handleCancel()}
        onClose={() => setSelectedRow(null)}
      />
    </div>
  );
}