import { jwt } from "jsonwebtoken";

//TODO: Implement NextAuth authenticate backend

export const authenticate = (context) => {
  const Authorization = context.event.headers.Authorization;
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, process.env.SESSION_SECRET);
    return userId;
  }
  throw new Error("Not authorized");
};
