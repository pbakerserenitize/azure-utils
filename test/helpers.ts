import { ImportMock } from 'ts-mock-imports'
import { createPromiseTableService } from 'azure-table-promise'
import * as AzureTablePromise from 'azure-table-promise/dist/src/CreateTableService'
import type { LegacyTableRow, TableRow } from '../index'

// The new table library does not yet support the shorthand of 'UseDevelopmentStorage=true'.
export const connection = `DefaultEndpointsProtocol=http;
AccountName=devstoreaccount1;
AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;
EndpointSuffix=false;
BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;
QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;
TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;`.replace(/[\r\n]*/gu, '')

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

export function mockTableService (): void {
  // This entire mock may be able to be removed when Azurite V3 supports tables.
  const createTableSvcShadow = createPromiseTableService

  ImportMock.mockOther(AzureTablePromise, 'createPromiseTableService', function createTableService (connection: string) {
    const tableService = createTableSvcShadow(connection)
    tableService.executeBatch = async function executeBatch (tableName: string, tableBatch: any, options?: any): Promise<any> {}

    return tableService
  })
}

export function unmockTableService (): void {
  ImportMock.restore()
}
