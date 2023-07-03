import jwt from "jsonwebtoken";

export class ItemGuard {
	checkTokenValid(token) {
		return jwt.verify(token, process.env["JWT_KEY"]);
	}
}
