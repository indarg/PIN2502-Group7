import AddBoxIcon from '@mui/icons-material/AddBox';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridRowIdGetter, GridRowSelectionModel, GridValidRowModel } from '@mui/x-data-grid';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
import QueryOptions from 'src/helpers/QueryOptions';
import { TPagination } from 'src/shared/hooks/usePagination';
import CRMNavToolbar from '../crm-nav-toolbar/CRMNavToolbar';
import Searcher from '../searcher/Searcher';
import './CustomTable.css';
type CustomTableProps<T extends GridValidRowModel> = {
  columns: GridColDef[],
  rows: T[],
  pageSizeOptions?: number[],
  pageNumber?: number,
  pageSize?: number,
  totalRecords?: number,
  paginate?: (pagination: TPagination) => void,
  title?: string,
  showSearcher?: boolean,
  showActions?: boolean,
  minHeight?: number,
  getRowId?: GridRowIdGetter<T>,
  checkboxSelector?: boolean,
  disableRowSelectionOnClick?: boolean,
  disableDensitySelector?: boolean,
  onRowSelected?: (rowsSelected: GridRowSelectionModel) => void,
  customActions?: ReactNode,
  loading?: boolean,
  doSearch?: (queryOptions?: QueryOptions<T>) => void,
  queryOptions?: QueryOptions<T>,
  value?: string,
  onChange?: (value: string) => void,
  createUrl?: string,
  createLabel?: string,
  reload?: () => void,
  recycleTrash?: () => void
};

export const CustomTable = <T extends GridValidRowModel,>({
  columns,
  rows,
  pageSizeOptions = [5, 10, 50, 100],
  showSearcher = false,
  showActions = false,
  minHeight,
  getRowId,
  paginate = () => null,
  pageNumber = 0,
  pageSize = 10,
  totalRecords = 0,
  customActions,
  checkboxSelector = false,
  disableRowSelectionOnClick = true,
  disableDensitySelector = true,
  onRowSelected,
  doSearch,
  queryOptions,
  value,
  onChange,
  createLabel = 'Crear',
  title,
  reload = () => { },
  createUrl = '',
  recycleTrash

}: CustomTableProps<T>) => {

  const handlePagination = (model: GridPaginationModel) => {
    paginate({ pageNumber: model.page, pageSize: model.pageSize });
  };
  const { isLoading } = useCRMCommon();
  const { pathname } = useLocation();
  const nav = useNavigate();
  const [recycleFilter, setRecycleFilter] = useState<boolean>(false);
  useEffect(() => {
  }, [rows,recycleFilter])
  return (
    <Box className='custom-table'>
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
      <div>
        {isLoading ? <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: 300
        }}>
          <CircularProgress />
        </div> : <DataGrid
          getRowId={getRowId}
          rows={rows}
          rowCount={totalRecords}
          columns={columns}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          initialState={{ pagination: { paginationModel: { page: pageNumber, pageSize } } }}
          pageSizeOptions={pageSizeOptions}
          onPaginationModelChange={handlePagination}
          checkboxSelection={checkboxSelector}
          disableMultipleRowSelection={!checkboxSelector}
          disableDensitySelector={disableDensitySelector}
          sx={{ border: 0, minHeight: 300, width: "99%", flexGrow: 1 }}
          onRowSelectionModelChange={(row) => onRowSelected ? onRowSelected(row) : null}
        />}
      </div>
    </Box>
  );
};
