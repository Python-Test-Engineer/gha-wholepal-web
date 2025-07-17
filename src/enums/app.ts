export enum StatusCodeEnum {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  Conflict = 409,

  TooManyRequests = 429,
  ValidationFailed = 422,
  InternalServerError = 500,
  GoneRequest = 410,
  PreconditionFailed = 412,
  PageNotFound = 404,
  AccessTokenExpired = 440,
  PasswordExpired = 498,
}

export enum InputTypeEnum {
  TEXT = "text",
  PASSWORD = "password",
  FILE = "file",
}
