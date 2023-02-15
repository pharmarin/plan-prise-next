import axios from "lib/axios";
import UnexpectedFileType from "lib/errors/UnexpectedFileType";
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

  /**
   * Send "register user" request with values submitted on the register page
   *
   * @param data RegisterForm values
   * @returns Axios promise
   */
  register(data: RegisterAttributes) {
    return this.post(
      {
        type: "users",
        attributes: data,
      },
      { customUrl: "/users/register", serializeToFormData: true }
    );
  }

  /**
   * Send "approve" request
   * Server-side validated: Admin only
   *
   * @returns Axios promise
   */
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

  /**
   * Send "forgot password request" to the server
   * A mail is sent if email is associated to known user
   *
   * @param data ForgotPasswordForm values
   * @returns Axios promise
   */
  forgotPassword(data: { email: string; recaptcha: string }) {
    return this.post(
      {
        ...this.identifier,
        attributes: data,
      },
      { customUrl: "/users/forgot-password" }
    );
  }

  getCertificate() {
    const url = BaseModel.buildUrl(this.pathWithID) + "/download-certificate";

    return axios.get(url, { responseType: "blob" }).then(async (response) => {
      switch (response.headers["content-type"]) {
        case "image/jpeg":
        case "image/png":
          return {
            type: "image",
            data: URL.createObjectURL(response.data),
          };
        case "application/pdf":
          return {
            type: "pdf",
            data: response.data,
          };
        default:
          throw new UnexpectedFileType();
      }
    });
  }
}

export default User;
