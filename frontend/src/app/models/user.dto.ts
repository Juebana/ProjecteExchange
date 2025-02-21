import { User } from "./user.model";

export interface UserApiJSON {
    _id: string;
    _username: string;
    _password: string;
    _token?: string;
  }

export class UserDTO {
    static fromJSONToUser(u: UserApiJSON): User {
        const user = new User(u._id, u._username, u._password, u._token);
        return user;
    }
}