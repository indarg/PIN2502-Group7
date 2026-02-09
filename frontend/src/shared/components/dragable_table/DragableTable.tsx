import AddBoxIcon from '@mui/icons-material/AddBox';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import RefreshIcon from '@mui/icons-material/Refresh';
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
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { GridColDef, GridRenderCellParams, GridValidRowModel } from '@mui/x-data-grid';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import PaginationTool from './PaginationTool';
import { TPagination } from 'src/shared/hooks/usePagination';
import QueryOptions from 'src/helpers/QueryOptions';
import CRMNavToolbar from '../crm-nav-toolbar/CRMNavToolbar';
import Searcher from '../searcher/Searcher';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import './DragableTable.css'

// The T type extends GridValidRowModel to ensure it has an 'id'
type TSortableRowProps<T extends GridValidRowModel> = {
  row: T; // This is the actual data object for the row
  columns: GridColDef<T>[]; // These are the column definitions
  id: string | number; // Dnd Kit requires a unique ID
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



// Componente principal de la tabla genérica
interface DraggableTableProps<T extends GridValidRowModel> {
  columns: GridColDef<T>[];
  pageSize?: number;
  pageNumber?: number,
  totalRecords?: number,
  showActions: boolean;
  paginate?: (pagination: TPagination) => void;
  title?: string,
  showSearcher?: boolean,
  reload?: () => void,
  doSearch?: (queryOptions?: QueryOptions<T>) => void,
  recycleTrash?: () => void,
  customActions?: ReactNode,
  createLabel?: string,
  queryOptions?: QueryOptions<T>,
  value?: string,
  onChange?: (value: string) => void,
  data:T[],
  rowOrder:number[],
  loading:boolean

}

export const DraggableTable = <T extends GridValidRowModel,>({onChange,queryOptions,value ,createLabel,customActions,data, columns,showActions,doSearch,pageSize,paginate,reload,showSearcher,title,totalRecords,recycleTrash,rowOrder,loading,pageNumber }: DraggableTableProps<T>) => {
    useEffect(() => {
  }, [data])
  const { pathname } = useLocation();
  const [rows, setRows] = useState<T[]>(data);
  const [page, setPage] = useState<number>(1);
  const rowsPerPage: number = 5;

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handlePageChange = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };
  const nav = useNavigate();

  const [recycleFilter, setRecycleFilter] = useState<boolean>(false);
  return (

    <Box component={"section"} className='dragable-table'>
      <CRMNavToolbar title={(title || 'Tabla') + (recycleFilter ? ' - Papelera de reciclaje' : '')} />
      <div className='toolbar'>
        {showSearcher && <Searcher doSearch={doSearch} value={value} onChange={onChange} queryOptions={queryOptions} />}
        {showActions &&
          <div className='actions'>
            {customActions &&
              <div>
                {customActions}
              </div>}
            <div>
              <Tooltip title={createLabel}>
                <IconButton color='primary' onClick={() => nav(`${pathname}/create`)}>
                  <AddBoxIcon />
                </IconButton>
              </Tooltip>
              <Tooltip color='primary' title="Recargar tabla">
                <IconButton className='icon-btn' onClick={reload}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {recycleTrash && <Tooltip title="Papelera">
                <IconButton onClick={() => {
                  recycleTrash()
                  setRecycleFilter(!recycleFilter)
                }} color={recycleFilter ? 'secondary' : 'primary'} className='icon-btn' >
                  <FolderDeleteIcon />
                </IconButton>
              </Tooltip>}
            </div>
          </div>}

      </div>
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
                  items={rowOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {rows.map((row, index) => (
                    <SortableTableRow<T> key={row.id} row={row} columns={columns} id={index} />
                  ))}
                </SortableContext>
              </TableBody>
            </DndContext>
          </Table>
        </TableContainer>
        <PaginationTool
          count={pageNumber ?? 1}
          page={pageNumber ?? 1}
          onPageChange={handlePageChange}
        />
      </Stack>
    </Box>

  );
};
