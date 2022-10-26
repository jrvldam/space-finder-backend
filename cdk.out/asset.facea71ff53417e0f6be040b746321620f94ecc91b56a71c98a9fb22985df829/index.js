"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// services/SpacesTable/Create.ts
var Create_exports = {};
__export(Create_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(Create_exports);
var import_aws_sdk = require("aws-sdk");
var import_crypto = require("crypto");
var TABLE_NAME = process.env.TABLE_NAME;
var dbClient = new import_aws_sdk.DynamoDB.DocumentClient();
async function handler(event, _context) {
  const result = {
    statusCode: 200,
    body: "Hello from DynamoDB!"
  };
  const item = {
    ...typeof event.body === "object" ? event.body : JSON.parse(event.body),
    spaceId: (0, import_crypto.randomUUID)()
  };
  try {
    await dbClient.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();
  } catch (err) {
    result.body = err instanceof Error ? err.message : "Unknown error while put on DynamoDB";
  }
  result.body = `Created with id: ${item.spaceId}`;
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
