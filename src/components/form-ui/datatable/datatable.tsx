"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "./pagination";

const DataTable = <T,>({
  data,
  columns,
  empty,
  useRawCellRender = false,
  paginationConfig = null,
  onRowSelectionChange = () => null,
  onRowClick = () => null,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  empty?: ReactNode;
  useRawCellRender?: boolean;
  paginationConfig?: App.PaginationConfig;
  onRowSelectionChange?: (data: T[]) => void;
  onRowClick?: (row: Row<T>) => void;
}) => {
  const t = useTranslations();
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  useEffect(() => {
    const selectedData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    onRowSelectionChange(selectedData);
  }, [rowSelection]);

  const renderEmpty = (): ReactNode => {
    if (empty) {
      return empty;
    }
    return t("no_results");
  };

  const renderColgroup = (): React.JSX.Element => (
    <colgroup>
      {map(columns, (column, index) => (
        <col
          key={index}
          style={column.size && { width: column.size, minWidth: column.size }}
        ></col>
      ))}
    </colgroup>
  );

  return (
    <div className="overflow-x-auto bg-card">
      <Table>
        {renderColgroup()}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick(row)}
              >
                {row.getVisibleCells().map((cell) => {
                  const rendered = flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  );

                  if (useRawCellRender) {
                    return (
                      <React.Fragment key={cell.id}>{rendered}</React.Fragment>
                    );
                  }

                  return <TableCell key={cell.id}>{rendered}</TableCell>;
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {renderEmpty()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {paginationConfig && !isEmpty(data) && (
        <div className="flex items-center justify-end space-x-2 px-4 py-3 border-t border-border">
          <Pagination paginationConfig={paginationConfig} />
        </div>
      )}
    </div>
  );
};

export default DataTable;
