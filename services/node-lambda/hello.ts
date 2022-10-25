import { S3 } from 'aws-sdk'

const s3Client = new S3()

async function handler(event: unknown, _context: unknown) {
  const buckets = await s3Client.listBuckets().promise()
  console.log('Got an event')
  console.log(event)

  return {
    statusCode: 200,
    body: `{"message":"Here your buckets","buckets":"${JSON.stringify(buckets.Buckets)}"}`,
  }
}

export { handler }
