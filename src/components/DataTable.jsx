import React from 'react';
import { Table, Pagination, Row, Col } from 'react-bootstrap';
import Loader from './Loader';
import EmptyState from './EmptyState';

export const DataTable = ({
  columns,
  data = [],
  loading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'No records match your criteria.',
  page = 0,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
  emptyActionText,
  onEmptyAction,
}) => {
  if (loading) {
    return <Loader message="Loading data..." />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <Table className="table-custom align-middle">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} style={col.width ? { width: col.width } : {}}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Row className="align-items-center mt-3 g-2">
          <Col xs={12} sm={6}>
            <span className="text-muted small">
              Showing page {page + 1} of {totalPages} ({totalElements} total items)
            </span>
          </Col>
          <Col xs={12} sm={6} className="d-flex justify-content-sm-end">
            <Pagination className="mb-0 pagination-sm">
              <Pagination.Prev
                disabled={page === 0}
                onClick={() => onPageChange && onPageChange(page - 1)}
              />
              {[...Array(totalPages)].map((_, i) => {
                if (
                  i === 0 ||
                  i === totalPages - 1 ||
                  (i >= page - 1 && i <= page + 1)
                ) {
                  return (
                    <Pagination.Item
                      key={i}
                      active={i === page}
                      onClick={() => onPageChange && onPageChange(i)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  );
                } else if (i === page - 2 || i === page + 2) {
                  return <Pagination.Ellipsis key={i} disabled />;
                }
                return null;
              })}
              <Pagination.Next
                disabled={page >= totalPages - 1}
                onClick={() => onPageChange && onPageChange(page + 1)}
              />
            </Pagination>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DataTable;
