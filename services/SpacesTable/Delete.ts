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

  const spaceId = event.queryStringParameters?.[PRIMARY_KEY]

  if (spaceId) {
    const deleteResult = await dbClient.delete({
      TableName: TABLE_NAME,
      Key: {
        [PRIMARY_KEY]: spaceId,
      },
    }).promise()

    result.body = JSON.stringify(deleteResult)
  }

  return result
}

export { handler }
