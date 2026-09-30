import { z } from 'zod';

export const correlationIdSchema = z.uuid();
export const ERROR_CODES = ['BAD_REQUEST', 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'INTERNAL_ERROR', 'CONFIGURATION_ERROR'] as const;
export const errorCodeSchema = z.enum(ERROR_CODES);
export const errorEnvelopeSchema = z.object({
  error: z.object({ code: errorCodeSchema, message: z.string().min(1), requestId: correlationIdSchema })
});
export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;
export const REQUEST_ID_HEADER = 'x-request-id' as const;
export const HEALTH_STATUS = 'ok' as const;
export const healthResponseSchema = z.object({ status: z.literal(HEALTH_STATUS), requestId: correlationIdSchema });
export type HealthResponse = z.infer<typeof healthResponseSchema>;
