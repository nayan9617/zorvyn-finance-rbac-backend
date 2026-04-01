const { z } = require("zod");

const trendQuerySchema = z.object({
  mode: z.enum(["monthly", "weekly"]).optional().default("monthly"),
  months: z.coerce.number().int().min(1).max(24).optional().default(6),
  weeks: z.coerce.number().int().min(1).max(52).optional().default(8),
});

const recentQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional().default(5),
});

module.exports = {
  trendQuerySchema,
  recentQuerySchema,
};
