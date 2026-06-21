import { useState } from 'react'
import type {
  ColumnDef,
  SortingState,
  FilterFn,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  globalFilterFn?: FilterFn<TData>
  externalFilter?: string
  onExternalFilterChange?: (value: string) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  externalFilter,
  onExternalFilterChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [internalFilter, setInternalFilter] = useState('')

  const hasExternal = externalFilter !== undefined
  const globalFilter = hasExternal ? externalFilter : internalFilter
  const setGlobalFilter = hasExternal ? (onExternalFilterChange ?? (() => {})) : setInternalFilter

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  })

  return (
    <div className="flex flex-col w-full">
      {!hasExternal && (
        <div className="flex items-center p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-64 pl-8 h-8 text-xs"
            />
          </div>
        </div>
      )}
      <div className="max-h-[50vh] overflow-auto border-b-0">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/20">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-[11px] font-semibold uppercase tracking-wide">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/20 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-0">
                      <div className="px-3 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground text-sm">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 p-3 border-t border-border bg-muted/10">
        <div className="flex-1 text-xs text-muted-foreground">
          Showing {table.getRowModel().rows.length} of {data.length} entries
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

// Helper to create sortable headers
export function SortableHeader({ column, title }: { column: any; title: string }) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting()}
      className="h-8 -ml-3 text-[11px] font-semibold uppercase tracking-wide hover:bg-muted/50"
    >
      {title}
      {column.getIsSorted() === 'asc' ? (
        <ChevronUp className="ml-2 size-3.5" />
      ) : column.getIsSorted() === 'desc' ? (
        <ChevronDown className="ml-2 size-3.5" />
      ) : (
        <ChevronsUpDown className="ml-2 size-3.5 text-muted-foreground/50" />
      )}
    </Button>
  )
}
