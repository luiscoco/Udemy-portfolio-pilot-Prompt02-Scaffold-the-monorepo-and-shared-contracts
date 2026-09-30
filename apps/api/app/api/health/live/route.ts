import { parseServerConfig } from '@portfolio-pilot/config/server';
import { healthResponseSchema, REQUEST_ID_HEADER } from '@portfolio-pilot/contracts';
import { errorResponse, getRequestId } from '../../../../lib/http';

export const runtime = 'nodejs';
export async function GET(request: Request): Promise<Response> {
  const requestId = getRequestId(request);
  try {
    parseServerConfig(process.env);
    return Response.json(healthResponseSchema.parse({ status: 'ok', requestId }), { headers: { [REQUEST_ID_HEADER]: requestId } });
  } catch {
    return errorResponse('CONFIGURATION_ERROR', 'Server configuration is invalid', requestId, 500);
  }
}
