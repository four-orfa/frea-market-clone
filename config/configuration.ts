export const jwtConfig = {
  secret: process.env.JWT_SECRET_KEY,
  signOptions: {
    expiresIn: 3600,
  },
};
