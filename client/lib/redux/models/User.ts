import BaseModel, {
  Attribute,
  AttributesKeysOnly,
} from "lib/redux/models/BaseModel";
import { RegisterAttributes, UserAttributes } from "lib/types";

class User
  extends BaseModel
  implements AttributesKeysOnly<User, UserAttributes>
{
  static type = "users";

  @Attribute()
  admin?: boolean;

  @Attribute()
  displayName?: string;

  @Attribute()
  email?: string;

  @Attribute()
  lastName?: string;

  @Attribute()
  firstName?: string;

  @Attribute()
  name?: string;

  @Attribute({
    setter: (value) => (value ? Number(value) : undefined),
  })
  rpps?: number;

  @Attribute()
  student?: boolean;

  @Attribute()
  active?: boolean;

  @Attribute()
  createdAt?: string;

  register(data: RegisterAttributes) {
    return this.post(
      {
        type: "users",
        attributes: data,
      },
      { customUrl: "/users/register", serializeToFormData: true }
    );
  }

  approve() {
    return this.patch(
      {
        ...this.identifier,
        attributes: {
          approvedAt: new Date().toISOString(),
        },
      },
      BaseModel.buildUrl(this.pathWithID) + "/approve"
    );
  }

  forgotPassword(data: { email: string; recaptcha: string }) {
    return this.post(
      {
        ...this.identifier,
        attributes: data,
      },
      { customUrl: "/users/forgot-password" }
    );
  }
}

export default User;
