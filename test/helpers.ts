import { ImportMock } from 'ts-mock-imports'
import { TableClient } from '@azure/data-tables'
import * as DataTables from '@azure/data-tables'
import { createPromiseTableService } from 'azure-table-promise'
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

export function mockTableService () {
  const { fromConnectionString } = TableClient
  // This entire mock may be able to be removed when Azurite V3 supports tables.
  ImportMock.mockOther(DataTables, 'TableClient', {
    fromConnectionString (connection: string, tableName: string, options: any): any {
      const tableService = createPromiseTableService(connection)
      const tableClient = fromConnectionString(connection, tableName, options)
      const createBatchShadow = tableClient.createBatch.bind(tableClient)

      tableClient.create = async function create (options?: any): Promise<any> {
        // Azurite V2 errors on new library method for creating a table, use old library method.
        return await tableService.createTableIfNotExists(tableName)
      }

      tableClient.createBatch = function createBatch (partitionKey: string): any {
        const batch = createBatchShadow(partitionKey)

        // Azurite V2 does not have complete support for batches; return a void promise or other mock response.
        batch.submitBatch = async function submitBatch (): Promise<any> {}

        return batch
      }

      return tableClient
    }
  })
}

export function unmockTableService () {
  ImportMock.restore()
}
