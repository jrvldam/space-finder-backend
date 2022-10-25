import { join } from 'path'
import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'

export class SpaceStack extends Stack {

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
      entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler',
    })

    const s3ListPolicy = new PolicyStatement()
    s3ListPolicy.addActions('s3:ListAllMyBuckets')
    s3ListPolicy.addResources('*') // bad practice
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy)

    const api = new LambdaRestApi(this, 'SpaceApi', {
      handler: helloLambdaNodeJs,
      proxy: false,
    })

    const helloLambdaResource = api.root.addResource('hello')
    helloLambdaResource.addMethod('GET')

    new GenericTable('SpacesTable', 'spaceId', this)
  }
}
