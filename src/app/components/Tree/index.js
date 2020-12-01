import React, { useCallback, useMemo } from 'react';

import styled from 'styled-components';

import {
  FiChevronRight,
  FiChevronDown,
  FiChevronsDown,
  FiChevronsRight,
  FiFolder,
  FiSettings,
} from 'react-icons/fi';

import { useTable, useBlockLayout, useExpanded } from 'react-table';
import { useEntities } from '../../state/entity-store';
import { GraphProvider, useGraph } from '../Org/state';
import { AnalyticsProvider, useAnalytics } from '../Org/analytics-context';

const Workspace = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;

  padding: 1rem;
`;

const Styles = styled.div`

  table {
    border-spacing: 0;
    border: 1px solid black;
    background-color: white;
    position: relative;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    tbody tr {
      :hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    th {
      position: sticky;
      top: 0; /* Don't forget this, required for the stickiness */
      border: 1px solid black;
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;


      :first-child {
        width: 0;
        min-width: 2.5rem;
      }

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const RowToggle = ({ row }) => row.isExpanded ? <FiChevronDown size="1.5em" /> : <FiChevronRight size="1.5em" />;

const RowIcon = ({ row }) => row.original.type === 'group' ? <FiFolder size="1.5em" /> : <FiSettings size="1.5em" />;

const RowHeader = ({ row }) => (
  <div
    {...row.getToggleRowExpandedProps({
      style: {
        paddingLeft: `${row.depth * 1}rem`,
        display: 'flex',
        flexWrap: 'nowrap',
      },
    })}
  >
    {row.canExpand ? <RowToggle row={row} /> : <div style={{ display: 'inline-block', width: '1.5em' }} />}
    <RowIcon row={row} />
  </div>
);

const TableCellContentContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
`;

const TableCellContentSpan = styled.span`
  ${({ indent, row }) => indent ? `paddingLeft: ${row.depth * 1}rem;` : ''}
  ${({ center }) => center ? 'text-align: center;' : ''}
  width: 100%;
`;

const TableContent = ({ children, ...props }) => (
  <TableCellContentSpan {...props}>
    {children}
  </TableCellContentSpan>
);

const TableCellContent = ({ cell, ...props }) => (
  <TableCellContentContainer>
    <TableContent {...props}>
      {cell.value}
    </TableContent>
  </TableCellContentContainer>
);

const CenteredTableCellContent = ({ ...props }) => <TableCellContent {...props} center />;

const TableCell = ({ cell, ...props }) => (
  <td {...cell.getCellProps()}>
    {cell.render('Cell')}
  </td>
);

const columns = [
  {
    // Build our expander column
    id: 'expander', // Make sure it has an ID
    Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
      <span {...getToggleAllRowsExpandedProps()}>
        {isAllRowsExpanded ? <FiChevronsDown size="1.5em" /> : <FiChevronsRight size="1.5em" />}
      </span>
    ),
    Cell: RowHeader,
  },
  {
    Header: 'Entity',
    id: 'entity',
    columns: [
      {
        Header: 'Name',
        Cell: ({ ...props }) => <TableCellContent indent {...props} />,
        accessor: 'name',
      },
      {
        Header: 'Manager',
        accessor: 'manager',
      },
    ],
  },
  {
    Header: 'Staffing',
    id: 'staffing',
    columns: [
      {
        Header: 'Overhead',
        Cell: CenteredTableCellContent,
        accessor: 'currentTotalOverhead',
      },
      {
        Header: 'Labor',
        Cell: CenteredTableCellContent,
        accessor: 'currentTotalFTE',
      },
    ],
  },
  {
    Header: 'Operations',
    id: 'operations',
    columns: [
      {
        Header: 'Workloads',
        Cell: CenteredTableCellContent,
        accessor: 'currentTotalWorkloads',
      },
    ],
  },
  {
    Header: 'Traits',
    id: 'traits',
    columns: [
      {
        Header: 'Payer Facing',
        id: 'payerFacing',
        Cell: CenteredTableCellContent,
        accessor: d => d.payerFacingInstances || d.payerFacing || '-',
      },
      {
        Header: 'Provider Facing',
        id: 'providerFacing',
        Cell: CenteredTableCellContent,
        accessor: d => d.providerFacingInstances || d.providerFacing || '-',
      },
      {
        Header: 'Requires PHI',
        id: 'requiresPHI',
        Cell: CenteredTableCellContent,
        accessor: d => d.PHIInstances || d.requiresPHI || '-',
      },
    ],
  },
];

const ColumnHeaderContainer = styled.th`
  ${({ center }) => center ? 'text-align: center;' : ''}
`;

const ColumnHeader = ({ column }) => (
  <ColumnHeaderContainer {...column.getHeaderProps()}>
    {column.render('Header')}
  </ColumnHeaderContainer>
);

const HeaderGroupContainer = styled.tr`
  background-color: #007bff;
  color: white;
  text-align: center;
`;

const HeaderGroup = ({ group }) => (
  <HeaderGroupContainer {...group.getHeaderGroupProps()}>
    {group.headers.map(column => (
      <ColumnHeader column={column} />
    ))}
  </HeaderGroupContainer>
);

const TableHeader = ({ groups }) => (
  <thead>
    {groups.map(headerGroup => (
      <HeaderGroup group={headerGroup} />
    ))}
  </thead>
);

const TableRow = ({ row }) => (
  <tr {...row.getRowProps()}>
    {row.cells.map(cell => <TableCell row={row} cell={cell} />)}
  </tr>
);

const defaultColumn = {
  Cell: TableCellContent,
};

const Tree = () => {
  const { entities } = useEntities();
  const graph = useGraph();

  const { enhanced } = useAnalytics();

  const enhancedEntities = useMemo(() => Object.entries(entities).reduce((acc, [key, values]) => ({
    ...acc,
    [key]: {
      ...enhanced[key],
      ...values,
    },
  }), {}), [enhanced, entities]);

  const getSubRows = useCallback(entity => graph.adjacencies(entity.id).map(childId => enhancedEntities[childId]), [enhancedEntities, graph]);

  const data = useMemo(() => [enhancedEntities[graph.root()]], [enhancedEntities, graph]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultColumn,
    getSubRows,
  }, useExpanded);

  return (
    <Workspace>
      <table {...getTableProps()}>
        <TableHeader groups={headerGroups} />
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return <TableRow row={row} />;
          })}
        </tbody>
      </table>
    </Workspace>
  );
};

const TreeProviders = ({ children }) => (
  <GraphProvider>
    <AnalyticsProvider>
      {children}
    </AnalyticsProvider>
  </GraphProvider>
);

export default () => (
  <TreeProviders>
    <Styles>
      <Tree />
    </Styles>
  </TreeProviders>
);
