// src/components/PaginationTool.jsx

import { Pagination } from '@mui/material';
import { ChangeEvent } from 'react';

type TPaginationToolProps = {
    count:number,
    page:number,
    onPageChange:(event: ChangeEvent<unknown>, newPage: number) => void
} 
const PaginationTool = ({ count, page, onPageChange }:TPaginationToolProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Pagination
        count={count}
        page={page}
        onChange={onPageChange}
        color="primary"
      />
    </div>
  );
};

export default PaginationTool;