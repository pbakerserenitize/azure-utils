import type { LegacyTableRow, TableRow } from '../index'

export const connection = 'UseDevelopmentStorage=true'

export const validError = "Cannot read property 'tableName' of undefined"

export const tableRows: Array<LegacyTableRow | TableRow> = [
  {
    partitionKey: 'test',
    rowKey: 'test1',
    data: 1
  },
  {
    PartitionKey: 'test',
    RowKey: 'test2',
    data: 2
  },
  {
    PartitionKey: {
      _: 'test',
      $: 'Edm.String'
    },
    RowKey: {
      _: 'test3',
      $: 'Edm.String'
    },
    data: 3
  }
]
