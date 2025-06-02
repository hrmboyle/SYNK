// netlify/functions/api.ts
import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions";
import serverless from 'serverless-http';
import app from '../../server/app'; // Imports your Express app



const serverlessHandlerInstance = serverless(app);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Log the entire event, or specifically headers and body
  console.log("NETLIFY FUNCTION RAW EVENT:", JSON.stringify(event, null, 2));
  console.log("NETLIFY FUNCTION REQUEST HEADERS:", JSON.stringify(event.headers, null, 2));
  console.log("NETLIFY FUNCTION REQUEST BODY:", event.body); // Body might be base64 encoded or a string

  const result = await serverlessHandlerInstance(event, context);
  return result as HandlerResponse;
};