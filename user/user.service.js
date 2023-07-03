import { PrismaService } from "../prisma.service.js";
import { UserException } from "./user.exception.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
	constructor() {
		this.prismaService = new PrismaService();
		this.userException = new UserException();
	}

	async getData(token) {
		const response = await this.prismaService.user.findUnique({
			where: {
				username: token.username,
			},
		});
		response.password = undefined;
		return {
			code: 200,
			response: {
				message: response,
			},
		};
	}

	async patchData(token, url) {
		const userExists = await this.prismaService.user.findUnique({
			where: {
				username: token.username,
			},
		});
		if (!userExists) {
			return {
				code: 404,
				response: {
					message: "User not found",
				},
			};
		}
		if (userExists.likedItems.includes(url.url)) {
			return {
				code: 200,
				response: {
					message: response,
				},
			};
		}
		userExists.likedItems.push(url.url);
		const response = await this.prismaService.user.update({
			where: {
				username: token.username,
			},
			data: userExists,
		});
		if (response) {
			response.password = undefined;
			return {
				code: 200,
				response: {
					message: response,
				},
			};
		}
	}

	async removeData(token, url) {
		const userExists = await this.prismaService.user.findUnique({
			where: {
				username: token.username,
			},
		});
		if (!userExists) {
			return {
				code: 404,
				response: {
					message: "User not found",
				},
			};
		}
		const newData = userExists.likedItems.filter((item) => item !== url.url);
		if (!newData) {
			return {
				code: 404,
				response: {
					message: "Item not found",
				},
			};
		}
		const response = await this.prismaService.user.update({
			where: {
				username: userExists.username,
			},
			data: {
				likedItems: {
					set: newData,
				},
			},
		});
		response.password = undefined;
		return {
			code: 200,
			response: response,
		};
	}

	async login(data) {
		const user = await this.prismaService.user.findUnique({
			where: {
				username: data.username,
			},
		});
		if (!user) {
			return {
				code: 401,
				response: {
					message: "User not found",
				},
			};
		}
		const result = bcrypt.compareSync(data.password, user.password);
		if (!result) {
			return {
				code: 401,
				response: {
					message: this.userException.InvalidUsernameOrPassword(),
				},
			};
		}
		const payload = { username: user.username, id: user.id };
		const token = jwt.sign(payload, process.env["JWT_KEY"], {
			expiresIn: "24h",
		});
		return {
			code: 200,
			response: {
				access_token: token,
			},
		};
	}

	async register(data) {
		const userExist = await this.prismaService.user.findUnique({
			where: {
				username: data.username,
			},
		});
		if (!userExist) {
			data.password = bcrypt.hashSync(data.password, 10);
			const user = await this.prismaService.user.create({
				data: data,
			});
			user.password = undefined;
			return {
				code: 200,
				response: {
					message: user,
				},
			};
		}
		return {
			code: 409,
			response: {
				message: this.userException.UsernameExist(),
			},
		};
	}
}
