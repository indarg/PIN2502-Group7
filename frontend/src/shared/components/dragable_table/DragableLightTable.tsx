import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { GridColDef, GridRenderCellParams, GridValidRowModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { TUpdateOrder } from 'src/models/TUpdateOrder';
import './DragableTable.css';

type TSortableRowProps<T extends GridValidRowModel> = {
  row: T;
  columns: GridColDef<T>[];
  id: string | number;
};

const SortableTableRow = <T extends GridValidRowModel,>({ row, columns, id }: TSortableRowProps<T>) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {columns.map((column) => (
        <TableCell key={column.field} align={column.align}>
          {column.renderCell
            ? column.renderCell({
              row,
              colDef: column,
              value: row[column.field],
            } as GridRenderCellParams<T>)
            : String(row[column.field])}
        </TableCell>
      ))}
    </TableRow>
  );
};


interface DragableLightTableProps<T extends GridValidRowModel> {
  columns: GridColDef<T>[];
  title?: string,
  value?: string,
  onChange?: (value: string) => void,
  data: T[],
  loading: boolean,
  orderField?: string,
  updateOrderAction: (ytVideosOrder: TUpdateOrder) => void
}

export const DragableLightTable = <T extends GridValidRowModel,>({ orderField = "id", onChange, value, data, columns, title, loading, updateOrderAction }: DragableLightTableProps<T>) => {
  const [rows, setRows] = useState<T[]>(data);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setRows((items) => {
                const oldIndex = items.findIndex((item) => item[orderField] === active.id);
                const newIndex = items.findIndex((item) => item[orderField] === over.id);

                // Reorder the array based on the drag and drop action
                const newRows = arrayMove(items, oldIndex, newIndex);

                // Re-index all rows to ensure their 'order' field is correct
                // This is the key fix
                const updatedRows = newRows.map((row, index) => {
                    return {
                        ...row,
                        'order': index + 1, // 'order' is now the same as the new index + 1
                    };
                });
                
                return updatedRows;
            });
        }
    };

  useEffect(() => {
  }, [data, columns, rows,loading])

  return (

    <>
      <Stack spacing={1} direction={"row"} justifyContent={"space-between"}>
        <Typography variant='h6' color='info' sx={{ margin: "20px 0" }}>Configurar orden</Typography>
        <Button onClick={() => updateOrderAction(rows.map((r) => {return {id:r.id,order:r[orderField]}}))} disabled={loading} color='success' variant='contained'>Actualizar orden</Button>
      </Stack>
      <Box component={"section"} className='dragable-table'>
        <Stack direction={"column"} spacing={1}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="draggable table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.field} align={column.align}>
                      {column.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <TableBody>
                  <SortableContext
                    items={rows.map((yt) => yt[orderField])}
                    strategy={verticalListSortingStrategy}
                  >
                    {rows.map((row, index) => (
                      <SortableTableRow<T> key={row.id} row={row} columns={columns} id={row[orderField]} />
                    ))}
                  </SortableContext>
                </TableBody>
              </DndContext>
            </Table>
          </TableContainer>

        </Stack>
      </Box>
    </>

  );
};
