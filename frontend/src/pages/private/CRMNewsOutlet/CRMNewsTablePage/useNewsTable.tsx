import { Visibility } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import { Avatar, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { TNews } from 'src/models/TNews';
import UtilService from 'src/services/UtilService';
type TUseNewsTableReturn = [
  GridColDef<TNews>[]
];
const useNewsTable = (deleteAction: (id: string) => void, hardDeleteAction: (id: string) => void, restoreAction: (id: string) => void): TUseNewsTableReturn => {
  const nav = useNavigate();

  const newsColumns: GridColDef<TNews>[] = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   minWidth: 50,
    //   valueGetter: (value, row) => `${row.id || ''}`,
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,
    // },
    {
      field: 'mainImage',
      headerName: 'Imagen principal',
      align: 'center',
      display: 'flex',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      minWidth: 120,
      renderCell: (params) => (
        params.row.mainImage && <img src={UtilService.resolveFile(params.row.mainImage.fileUrl ?? '')} alt='image' style={{ width: 70, height: 40, borderRadius: "10px" }} />
      )
    },
    {
      field: 'headline',
      headerName: 'Titulo',
      minWidth: 160,
      flex: 1,
      align: 'left',
      display: 'flex',
      renderCell: (params) => (
        params.row.headline && <Typography variant='body1' sx={{ fontWeight: 300 }}>{params.row.headline}</Typography>
      )
    },

    // {
    //   field: 'draft',
    //   headerName: 'Borrador',
    //   minWidth: 50,
    //   flex: 1,
    //   align: 'left',
    //   display: 'flex',
    //   valueGetter: (value, row) => `${row.draft ? 'SI' : 'NO'}`,
    // },
    {
      field: 'published',
      headerName: 'Publicado',
      minWidth: 120,
      width: 120,
      maxWidth: 120,
      flex: 1,
      sortable: true,
      disableColumnMenu: true,
      align: 'left',
      display: 'flex',
      renderCell: (params) => (
        <Chip label={params.row.published ? 'SI' : 'NO'} color={params.row.published ? 'success' : 'error'} />
      )
    },
    {
      field: 'createdBy',
      headerName: 'Creado por',
      minWidth: 120,
      width: 120,
      maxWidth: 120,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      align: 'left',
      display: 'flex',
      renderCell: (params) => (
        <Tooltip title={`${params.row.createdBy.firstName} ${params.row.createdBy.lastName}`}>
          <Avatar alt={`${params.row.createdBy.firstName}`} src={params.row.createdBy?.profileImage ? UtilService.resolveFile(params.row.createdBy.profileImage.fileUrl) : ''} />
        </Tooltip>
      )
    },
    {
      field: 'createdAt',
      headerName: 'Creación',
      minWidth: 120,
      width: 120,
      maxWidth: 120,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      align: 'left',
      display: 'flex',
      renderCell: (params) => (
        <Typography variant='body1' sx={{ fontWeight: 300 }}>{UtilService.parseDate(params.row.createdAt)}</Typography>
      )
    },
    {
      field: 'updatedBy',
      headerName: 'Actualizado por',
      minWidth: 120,
      width: 120,
      maxWidth: 120,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      align: 'center',
      display: 'flex',
      renderCell: (params) => (
        params.row.updatedBy ? <Tooltip title={`${params.row.updatedBy.firstName} ${params.row.updatedBy.lastName}`}>
          <Avatar alt={`${params.row.updatedBy.firstName}`} src={params.row.updatedBy?.profileImage ? UtilService.resolveFile(params.row.updatedBy?.profileImage.fileUrl) : ''} />
        </Tooltip> : <></>
      )
    },
    {
      field: 'updatedAt',
      headerName: 'Ultima modificación',
      minWidth: 120,
      width: 120,
      maxWidth: 120,
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      align: 'left',
      display: 'flex',
      renderCell: (params) => (
        <Typography variant='body1' sx={{ fontWeight: 300 }}>{UtilService.parseDate(params.row.updatedAt)}</Typography>
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
      maxWidth: 60,
      renderCell: (params) => (
        !params.row.isDeleted ?
          <Tooltip title="Enviar a papelera">
            <IconButton onClick={() => deleteAction(params.row.id.toString())} style={{ minWidth: 30 }}>
              <DeleteIcon color='secondary' />
            </IconButton>
          </Tooltip> :
          <Tooltip title="Eliminar permanentemente">
            <IconButton onClick={() => hardDeleteAction(params.row.id.toString())} style={{ minWidth: 30 }}>
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
      maxWidth: 60,
      renderCell: (params) =>
      (
        !params.row.isDeleted ?

          <Tooltip title="Ver detalles">
            <IconButton onClick={() => nav(`${params.row.id}`)} style={{ minWidth: 30 }}>
              <Visibility width={15} height={15} />
            </IconButton>
          </Tooltip> :
          <Tooltip title="Restaurar">
            <IconButton onClick={() => restoreAction(params.row.id.toString())} style={{ minWidth: 30 }}>
              <RestorePageIcon color='success' />
            </IconButton>
          </Tooltip>
      )
    },
  ];



  return [newsColumns];
};

export default useNewsTable;
