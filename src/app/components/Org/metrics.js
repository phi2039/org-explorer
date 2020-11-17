import { isEqual } from './analytics';

const isGroup = isEqual('type', 'group');
const isFunction = isEqual('type', 'function');

export const metrics = [
  {
    name: 'currentFTE',
    aggregation: 'sum',
    params: ['currentFTE'],
  },
  {
    name: 'currentTotalOverhead',
    aggregation: 'sum',
    params: ['managerFTE'],
  },
  {
    name: 'Count',
    aggregation: 'count',
  },
  {
    name: 'groups',
    aggregation: 'countWhere',
    params: [isGroup],
  },
  {
    name: 'currentTotalWorkloads',
    aggregation: 'countWhere',
    params: [isFunction],
  },
  {
    name: 'PHIInstances',
    aggregation: 'countWhere',
    params: [isEqual('requiresPHI', 'Yes')],
  },
  {
    name: 'payerFacingInstances',
    aggregation: 'countWhere',
    params: [isEqual('payerFacing', 'Yes')],
  },
  {
    name: 'providerFacingInstances',
    aggregation: 'countWhere',
    params: [isEqual('providerFacing', 'Yes')],
  },
  {
    name: 'PHIFTE',
    aggregation: 'sumWhere',
    params: [isEqual('requiresPHI', 'Yes'), 'currentFTE'],
  },
  {
    name: 'payerFacingFTE',
    aggregation: 'sumWhere',
    params: [isEqual('payerFacing', 'Yes'), 'currentFTE'],
  },
  {
    name: 'providerFacingFTE',
    aggregation: 'sumWhere',
    params: [isEqual('providerFacing', 'Yes'), 'currentFTE'],
  },
];

export const measures = [{
  name: 'currentTotalFTE',
  value: e => (e.currentFTE || 0) + (e.currentTotalOverhead || 0),
}];
