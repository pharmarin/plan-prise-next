import BaseModel from "lib/redux/models/BaseModel";

class User extends BaseModel {
  static type = "users";

  admin: boolean = this.getAttribute("admin") ?? false;

  display_name: string = this.getAttribute("display_name");

  email: string = this.getAttribute("email");

  last_name: string = this.getAttribute("last_name");

  first_name: string = this.getAttribute("first_name");

  rpps: string = this.getAttribute("rpps");

  status: string = this.getAttribute("status");

  created_at: string = this.getAttribute("created_at");

  approved_at: string = this.getAttribute("approved_at");
}

export default User;
