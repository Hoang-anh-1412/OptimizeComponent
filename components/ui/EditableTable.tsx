'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  Row,
} from '@tanstack/react-table'

// ✅ Type definition cho table meta với updateData function
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    updateData?: (rowIndex: number, columnId: string, value: any) => void
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    editable?: boolean
    validate?: (value: any) => string | null
  }
}

export interface EditableCellProps {
  value: any
  row: Row<any>
  columnId: string
  onUpdate: (rowIndex: number, columnId: string, value: any) => void
  editable?: boolean
  validate?: (value: any) => string | null // Return error message or null if valid
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  columnId,
  onUpdate,
  editable = true,
  validate,
}) => {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)

  // Update local value when initialValue changes
  useEffect(() => {
    setValue(initialValue)
    setError(null) // Reset error when initial value changes
  }, [initialValue])

  const handleBlur = () => {
    // Validate before updating
    if (validate) {
      const errorMessage = validate(value)
      if (errorMessage) {
        setError(errorMessage)
        return // Don't update if validation fails
      }
    }
    
    setError(null)
    if (value !== initialValue) {
      onUpdate(row.index, columnId, value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Validate before updating
      if (validate) {
        const errorMessage = validate(value)
        if (errorMessage) {
          setError(errorMessage)
          return // Don't update if validation fails
        }
      }
      
      setError(null)
      e.currentTarget.blur()
      if (value !== initialValue) {
        onUpdate(row.index, columnId, value)
      }
    } else if (e.key === 'Escape') {
      setValue(initialValue)
      setError(null)
      e.currentTarget.blur()
    }
    // Tab will trigger blur naturally, and handleBlur will call onUpdate if value changed
    // Don't need to handle Tab explicitly to avoid double update
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  // If not editable, just display the value
  if (!editable) {
    return <span className="px-2 py-1 block">{value || '-'}</span>
  }

  // Always show input field (using Input component styling)
  return (
    <div className="w-full">
      <input
        type="text"
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 transition-colors ${
          error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-transparent hover:border-gray-400'
        }`}
        placeholder="Nhập giá trị..."
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}

// ✅ Memo EditableCell theo value và editable để tránh re-render không cần thiết
const MemoEditableCell = React.memo(EditableCell, (prev, next) => {
  return prev.value === next.value && prev.editable === next.editable && prev.row.id === next.row.id
})

// Export MemoEditableCell để có thể sử dụng trực tiếp
export { MemoEditableCell }

interface EditableTableProps<T extends Record<string, any>> {
  data: T[]
  columns: ColumnDef<T>[]
  onDataChange?: (data: T[]) => void
}

// Export helper function to create editable cell
export const createEditableCell = <T extends Record<string, any>>(
  onUpdate: (rowIndex: number, columnId: string, value: any) => void
) => {
  return ({ row, getValue, column }: any) => {
    const columnId = column.id || column.accessorKey
    const isEditable = column.columnDef?.meta?.editable !== false
    
    return (
      <EditableCell
        value={getValue()}
        row={row}
        columnId={columnId}
        onUpdate={onUpdate}
        editable={isEditable}
      />
    )
  }
}

export function EditableTable<T extends Record<string, any>>({
  data: initialData,
  columns,
  onDataChange,
}: EditableTableProps<T>) {
  const [data, setData] = useState(initialData)
  const isFirstRender = useRef(true)
  
  // Update data when initialData prop changes (if needed)
  useEffect(() => {
    setData(initialData)
  }, [initialData])

  // ✅ Sync data changes với parent component sau khi render (tránh warning)
  useEffect(() => {
    // Skip lần đầu tiên (mount) để tránh gọi onDataChange không cần thiết
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onDataChange?.(data)
  }, [data, onDataChange])

  // ✅ Memoize updateData function với useCallback để giữ reference stable
  const updateData = useCallback((rowIndex: number, columnId: string, value: any) => {
    setData((prevData) => {
      const newData = [...prevData]
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value,
      }
      // ❌ KHÔNG gọi onDataChange ở đây - sẽ gây warning
      // onDataChange sẽ được gọi trong useEffect sau khi render xong
      return newData
    })
  }, []) // ✅ Empty deps - function reference sẽ stable

  // Use columns as-is (all columns should have cell function defined)
  const editableColumns = useMemo(() => {
    return columns
  }, [columns])

  const table = useReactTable({
    data,
    columns: editableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // ✅ Use getRowId để Tanstack Table chỉ tính toán row bị thay đổi
    getRowId: (row, index) => {
      // Use row.id if available (should be stable), otherwise fallback to index
      const rowId = (row as any).id
      if (rowId !== undefined && rowId !== null) {
        return String(rowId)
      }
      // Fallback: use index (less stable but necessary if no id)
      return String(index)
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    // ✅ Provide updateData function to table meta
    meta: {
      updateData,
    },
  })

  return (
    <div className="w-full">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 py-2 text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {'>>'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Trang{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </strong>
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
            className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {[10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Hiển thị {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

