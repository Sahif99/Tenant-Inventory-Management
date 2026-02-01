export const tenantMiddleware = (req, _, next) => {
  req.tenantId = req.user.tenantId;
  next();
};
