// netlify/functions/api.ts
import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions";
import serverless from 'serverless-http';
import app from '../../server/app'; // <--- CHANGE THIS LINE

const serverlessHandlerInstance = serverless(app);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const result = await serverlessHandlerInstance(event, context);
  return result as HandlerResponse;
};