import { Button, IconButton, Tooltip, Typography } from '@mui/material';

import { Visibility } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { TTag } from 'src/models/TTag';
type TUseNewsTableReturn = [
  GridColDef<TTag>[]
];
const useTagTable = (deleteAction: (id: string) => void): TUseNewsTableReturn => {
  const nav = useNavigate();

  const tagColumns: GridColDef<TTag>[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 180,
      valueGetter: (value, row) => `${row.id || ''}`,
    },
    {
      field: 'code',
      headerName: 'Código',
      width: 100,
      flex: 1,
      align: 'left',
      display: 'flex',
      renderCell: (params) => (
        params.row.code && <Typography variant='body1' sx={{ fontWeight: 300 }}>{params.row.code}</Typography>
      )
    },

    {
      field: 'name',
      headerName: 'Nombre',
      minWidth: 160,
      width: 160,
      flex: 1,
      align: 'left',
      display: 'flex',
      renderCell: (params) => (
        params.row.name && <Typography variant='body1' sx={{ fontWeight: 300 }}>{params.row.name}</Typography>
      )
    },
    {
      field: 'eliminar',
      headerName: 'Eliminar',
      description: '',
      sortable: false,
      disableColumnMenu: true,
      minWidth: 100,
      width: 60,
      renderCell: (params) => (
        <Tooltip title="Eliminar permanentemente">
          <IconButton onClick={() => deleteAction(params.row.id.toString())} style={{ minWidth: 30 }}>
            <DeleteForeverIcon color='error' />
          </IconButton>
        </Tooltip>
      )
    },
    {

      field: 'ver',
      headerName: 'Ver',
      description: '',
      sortable: false,
      disableColumnMenu: true,
      minWidth: 100,
      width: 60,
      renderCell: (params) => (
        <Button style={{ minWidth: 30 }} onClick={() => nav(`${params.row.id}`)}>
          <Visibility sx={{color:"gray"}} width={15} height={15} />
        </Button>
      )
    },
  ];



  return [tagColumns];
};

export default useTagTable;
