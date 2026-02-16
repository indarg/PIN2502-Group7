import { Button, Chip, IconButton, Tooltip, Typography } from '@mui/material';

import { Visibility } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { TYoutubeVideo } from 'src/models/TYoutubeVideo';
type TUseNewsTableReturn = [
  GridColDef<TYoutubeVideo>[]
];
const useYoutubeVideoTable = (deleteAction: (id: string) => void): TUseNewsTableReturn => {
  const nav = useNavigate();

  const ytVideosColumns: GridColDef<TYoutubeVideo>[] = [
    {
      field: 'id',
      headerName: 'Identificador',
      minWidth: 180,
      renderCell: (params) => <a href={`https://www.youtube.com/watch?v=${params.id}`} target="_blank" rel="noopener noreferrer">{params.id}</a>,
    },
    {
      field: 'title',
      headerName: 'Título',
      minWidth: 160,
      width: 160,
      flex: 1,
      align: 'left',
      display: 'flex',
      renderCell: (params) => (
        params.row.title && <Typography variant='body1' sx={{ fontWeight: 300 }}>{params.row.title}</Typography>
      )
    },
    {
      field: 'active',
      headerName: 'Activo',
      minWidth: 120,
      width: 120,
      maxWidth: 120,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      align: 'left',
      display: 'flex',
      renderCell: (params) => (
        <Chip label={params.row.active ? 'SI' : 'NO'} color={params.row.active ? 'success' : 'error'} />
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
          <Visibility sx={{ color: "gray" }} width={15} height={15} />
        </Button>
      )
    },
  ];

  



  return [ytVideosColumns];
};

export default useYoutubeVideoTable;
