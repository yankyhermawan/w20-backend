import express from "express";
import { UserService } from "./user/user.service.js";
import { ItemGuard } from "./item/item.guard.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 4000;
const userService = new UserService();
const itemGuard = new ItemGuard();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.post("/login", async (req, res) => {
	const data = req.body;
	const response = await userService.login(data);
	res.status(response.code).json(response.response);
});

app.post("/register", async (req, res) => {
	const data = req.body;
	const response = await userService.register(data);
	res.status(response.code).json(response.response);
});

app
	.route("/items")
	.get(async (req, res) => {
		console.log(req.headers["authorization"]);
		const token = String(req.headers["authorization"].split(" ")[1]);
		const checkToken = itemGuard.checkTokenValid(token);
		if (checkToken) {
			const response = await userService.getData(checkToken);
			return res.status(200).json(response.response);
		}
		return res.status(401).json({ message: "Unauthorized" });
	})
	.patch(async (req, res) => {
		const token = String(
			req.headers["authorization"].split(" ")[1].replace("'", "")
		);
		const checkToken = itemGuard.checkTokenValid(token);
		if (checkToken) {
			const response = await userService.patchData(checkToken, req.body);
			return res.status(response.code).json(response.response);
		}
	})
	.delete(async (req, res) => {
		const token = String(
			req.headers["authorization"].split(" ")[1].replace("'", "")
		);
		const checkToken = itemGuard.checkTokenValid(token);
		if (checkToken) {
			const response = await userService.removeData(checkToken, req.body);
			return res.status(response.code).json(response.response);
		}
	});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
