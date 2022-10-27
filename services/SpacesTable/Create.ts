import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { randomUUID } from 'crypto'

const TABLE_NAME = process.env.TABLE_NAME
const dbClient = new DynamoDB.DocumentClient()

async function handler(event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB!',
  }

  const item = {
    ...(typeof event.body === 'object' ? event.body : JSON.parse(event.body)),
    spaceId: randomUUID(),
  }

  try {
    await dbClient.put({
      TableName: TABLE_NAME!,
      Item: item,
    }).promise()

    result.body = `Created with id: ${item.spaceId}`
  } catch (err) {
    result.body = err instanceof Error ? err.message : 'Unknown error while put on DynamoDB'
  }

  return result
}

export { handler }
