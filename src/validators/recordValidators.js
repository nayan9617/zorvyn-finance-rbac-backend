const { z } = require("zod");

const recordType = z.enum(["income", "expense"]);

const createRecordSchema = z.object({
  amount: z.number().positive(),
  type: recordType,
  category: z.string().min(2).max(100),
  date: z.coerce.date(),
  notes: z.string().max(500).optional(),
});

const updateRecordSchema = z
  .object({
    amount: z.number().positive().optional(),
    type: recordType.optional(),
    category: z.string().min(2).max(100).optional(),
    date: z.coerce.date().optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

const listRecordQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  type: recordType.optional(),
  category: z.string().trim().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(["date", "amount", "createdAt"]).optional().default("date"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

const idParamSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid resource id format"),
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  listRecordQuerySchema,
  idParamSchema,
};
