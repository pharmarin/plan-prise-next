import BaseModel from "lib/redux/models/BaseModel";

class User extends BaseModel {
  static type = "users";

  admin?: boolean = this.getAttribute("admin") ?? false;

  displayName: string = this.getAttribute("displayName");

  email: string = this.getAttribute("email");

  lastName?: string = this.getAttribute("lastName");

  firstName?: string = this.getAttribute("firstName");

  name: string = this.getAttribute("");

  rpps?: string = this.getAttribute("rpps");

  student?: boolean = this.getAttribute("student");

  createdAt: string = this.getAttribute("createdAt");

  activeAt: string = this.getAttribute("activeAt");
}

export default User;
