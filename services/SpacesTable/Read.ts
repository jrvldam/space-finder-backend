import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

const TABLE_NAME = process.env.TABLE_NAME
const dbClient = new DynamoDB.DocumentClient()

async function handler(_event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB!',
  }

  try {
    const queryResponse = await dbClient.scan({ TableName: TABLE_NAME! }).promise()
    result.body = JSON.stringify(queryResponse)
  } catch (err) {
    result.body = err instanceof Error ? err.message : 'Unknown error while put on DynamoDB'
  }

  return result
}

export { handler }
