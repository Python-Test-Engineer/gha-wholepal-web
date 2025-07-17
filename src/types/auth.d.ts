declare namespace Auth {
  import("@/enums/user");
  import { UserTypeEnum, UserStatusEnum } from "@/enums/user";

  interface UserCertificate {
    email: string;
    password: string;
  }

  interface Company extends App.Entity {
    name: string;
    type: UserTypeEnum;
  }

  interface User extends App.Entity {
    email: string;
    fullName: string;
    emailVerifiedAt: App.DateTime;
    jobTitle: string;
    lastActivatedAt: App.DateTime;
    location: string;
    phoneNumber: string;
    status: UserStatusEnum;
    type: UserTypeEnum;
    company: Company;
  }

  interface UserAuthentication {
    expireAt: number;
    accessToken: string;
    user: User;
    refreshToken: string;
  }

  interface RegisterData {
    type: UserTypeEnum;
    companyName: string;
    fullName: string;
    email: string;
    password: string;
  }

  interface RequestJoinCompanyData {
    email: string;
    companyId: string;
  }

  type UpdateUserData = Pick<
    User,
    "fullName" | "email" | "phoneNumber" | "jobTitle" | "location"
  > & {
    company: string;
  };
}
