import { APIGatewayProxyEvent } from "aws-lambda";

export function getEventBody(event: APIGatewayProxyEvent) {
  return typeof event.body === 'string' ? JSON.parse(event.body) : event.body
}
