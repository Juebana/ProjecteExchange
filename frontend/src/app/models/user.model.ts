export class User {
    constructor(
      private _id: string,
      private _username: string,
      private _password: string,
      private _token?: string
    ) {}
    
    get id(): string {
      return this._id;
    }

    set id(value: string) {
      this._id = value;
    }

    get username(): string {
      return this._username;
    }
  
    set username(value: string) {
      this._username = value;
    }
  
    get password(): string {
      return this._password;
    }
  
    set password(value: string) {
      this._password = value;
    }
  
    get token(): string | undefined {
      return this._token;
    }
  
    set token(value: string | undefined) {
      this._token = value;
    }
  }
  