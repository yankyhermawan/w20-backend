export class UserException {
	UserNotFound() {
		return "User Not Found";
	}

	InvalidUsernameOrPassword() {
		return "Wrong Username or Password";
	}

	UsernameExist() {
		return "Username Already Registered";
	}
}
