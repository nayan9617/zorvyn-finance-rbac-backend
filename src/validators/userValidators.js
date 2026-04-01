const { z } = require("zod");
const { ROLES, USER_STATUSES } = require("../constants/roles");

const createUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]).optional(),
  status: z.enum([USER_STATUSES.ACTIVE, USER_STATUSES.INACTIVE]).optional(),
});

const updateUserSchema = z
  .object({
    role: z.enum([ROLES.ADMIN, ROLES.ANALYST, ROLES.VIEWER]).optional(),
    status: z.enum([USER_STATUSES.ACTIVE, USER_STATUSES.INACTIVE]).optional(),
    name: z.string().min(2).max(80).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

module.exports = {
  createUserSchema,
  updateUserSchema,
};
