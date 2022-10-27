import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult, Context } from 'aws-lambda'

const TABLE_NAME = process.env.TABLE_NAME!
const PRIMARY_KEY = process.env.PRIMARY_KEY!
const dbClient = new DynamoDB.DocumentClient()

async function handler(event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB!',
  }

  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY in event.queryStringParameters) {
        result.body = await queryWithPrimaryPartition(event.queryStringParameters)
      } else {
        result.body = await queryWithSecondaryPartition(event.queryStringParameters)
      }
    } else {
      result.body = await scanTable()
    }
  } catch (err) {
    result.body = err instanceof Error ? err.message : 'Unknown error while put on DynamoDB'
  }

  return result
}

async function queryWithSecondaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters): Promise<string> {
  const [[queryKey, queryValue]] = Object.entries(queryParams)
  const queryResponse = await dbClient.query({
    TableName: TABLE_NAME,
    IndexName: queryKey,
    KeyConditionExpression: '#zz = :zzz', // arbitrary values except the equal sign
    ExpressionAttributeNames: {
      '#zz': queryKey,
    },
    ExpressionAttributeValues: {
      ':zzz': queryValue,
    },
  }).promise()

  return JSON.stringify(queryResponse.Items)
}

async function queryWithPrimaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters): Promise<string> {
  const keyValue = queryParams[PRIMARY_KEY]

  const queryResponse = await dbClient.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: '#zz = :zzz', // arbitrary values except the equal sign
    ExpressionAttributeNames: {
      '#zz': PRIMARY_KEY,
    },
    ExpressionAttributeValues: {
      ':zzz': keyValue,
    },
  }).promise()

  return JSON.stringify(queryResponse.Items)
}

async function scanTable(): Promise<string> {
  const queryResponse = await dbClient.scan({ TableName: TABLE_NAME }).promise()
  return JSON.stringify(queryResponse.Items)
}

export { handler }
