import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

const TABLE_NAME = process.env.TABLE_NAME!
const PRIMARY_KEY = process.env.PRIMARY_KEY!
const dbClient = new DynamoDB.DocumentClient()

async function handler(event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB!',
  }

  try {
    let queryResponse

    if (event.queryStringParameters) {
      if (PRIMARY_KEY in event.queryStringParameters) {
        const keyValue = event.queryStringParameters[PRIMARY_KEY]

        queryResponse = await dbClient.query({
          TableName: TABLE_NAME,
          KeyConditionExpression: '#zz = :zzz', // arbitrary values except the equal sign
          ExpressionAttributeNames: {
            '#zz': PRIMARY_KEY,
          },
          ExpressionAttributeValues: {
            ':zzz': keyValue,
          },
        }).promise()
      }
    } else {
      queryResponse = await dbClient.scan({ TableName: TABLE_NAME }).promise()
    }

    result.body = JSON.stringify(queryResponse)
  } catch (err) {
    result.body = err instanceof Error ? err.message : 'Unknown error while put on DynamoDB'
  }

  return result
}

export { handler }
