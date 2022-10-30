import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { getEventBody } from './Utils'

const TABLE_NAME = process.env.TABLE_NAME!
const PRIMARY_KEY = process.env.PRIMARY_KEY!
const dbClient = new DynamoDB.DocumentClient()

async function handler(event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB!',
  }

  const requestBody = getEventBody(event)
  const spaceId = event.queryStringParameters?.[PRIMARY_KEY]

  if (requestBody && spaceId) {
    const [[requestBodyKey, requestBodyValue]] = Object.entries(requestBody)

    const updateResult = await dbClient.update({
      TableName: TABLE_NAME,
      Key: {
        [PRIMARY_KEY]: spaceId,
      },
      UpdateExpression: 'set #zzzNew = :new',
      ExpressionAttributeNames: {
        '#zzzNew': requestBodyKey,
      },
      ExpressionAttributeValues: {
        ':new': requestBodyValue,
      },
      ReturnValues: 'UPDATED_NEW',
    }).promise()

    result.body = JSON.stringify(updateResult)
  }

  return result
}

export { handler }
