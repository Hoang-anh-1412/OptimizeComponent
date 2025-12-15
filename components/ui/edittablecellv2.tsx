import React from 'react';
import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowData,
} from '@tanstack/react-table';
import '@tanstack/react-table'; // bắt buộc để mở rộng type

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateCell?: (rowId: string, columnId: string, value: any) => void;
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    updateCell?: (rowId: string, columnId: string, value: TValue) => void;
  }
}
// EditableCell component
interface EditableCellProps<TData extends RowData> {
  cell: any;
}

function EditableCell<TData extends RowData>({ cell }: { cell: any }) {
  const tableMeta = cell.getContext().table.options.meta as {
    updateCell?: (rowId: string, columnId: string, value: any) => void;
  };

  const [value, setValue] = React.useState(cell.getValue() as string | number);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

  const onBlur = () => {
    tableMeta?.updateCell?.(cell.row.id, cell.column.id, value);
  };

  return <input value={value} onChange={onChange} onBlur={onBlur} style={{ width: '100%' }} />;
}


const MemoizedEditableCell = React.memo(EditableCell) as typeof EditableCell;

// Table component
interface Person {
  id: string;
  name: string;
  age: number;
}

const EditableTableV2: React.FC = () => {
  const [data, setData] = React.useState<Person[]>([
    { id: '1', name: 'Alice', age: 25 },
    { id: '2', name: 'Bob', age: 30 },
    { id: '3', name: 'Charlie', age: 35 },
  ]);

  const columns = React.useMemo<ColumnDef<Person>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ cell }) => <MemoizedEditableCell cell={cell} />,
      meta: {
        updateCell: (rowId: string, columnId: string, value: any) => {
          setData(old =>
            old.map(row =>
              row.id === rowId ? { ...row, [columnId]: value } : row
            )
          );
        },
      },
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: ({ cell }) => <MemoizedEditableCell cell={cell} />,
      meta: {
        updateCell: (rowId: string, columnId: string, value: any) => {
          setData(old =>
            old.map(row =>
              row.id === rowId ? { ...row, [columnId]: value } : row
            )
          );
        },
      },
    },
  ], [setData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.id,
    meta: {
      updateCell: (rowId: string, columnId: string, value: any) => {
        setData(old =>
          old.map(row => (row.id === rowId ? { ...row, [columnId]: value } : row))
        );
      },
    },
  });

  return (
    <table border={1} style={{ borderCollapse: 'collapse', width: '300px' }}>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} style={{ padding: '4px' }}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} style={{ padding: '4px' }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTableV2;
