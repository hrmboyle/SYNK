// netlify/functions/api.ts
import type { Handler, HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions"; // Explicitly import HandlerResponse
import serverless from 'serverless-http';
import app from '../../server/index'; // Ensure 'app' from server/index.ts is correctly typed (usually it is by default for Express)

// This function is what serverless-http creates.
// Its actual return type (when awaited) should be compatible with HandlerResponse.
const serverlessHandlerInstance = serverless(app);

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // // You can add any custom logic here before passing to Express if needed
  // // For example, setting some context based on Netlify's context object

  // Pass the event and context to the serverless-http handler
  const result = await serverlessHandlerInstance(event, context);

  // Assert that the result conforms to the HandlerResponse interface
  return result as HandlerResponse;
};