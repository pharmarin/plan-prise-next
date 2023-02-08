import BaseModel, {
  Attribute,
  AttributesKeysOnly,
} from "lib/redux/models/BaseModel";
import { UserAttributes } from "lib/types";

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
}

export default User;
