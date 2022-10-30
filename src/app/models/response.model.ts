export default interface Response {
  timeStamp: Date;
  statusCode: Number;
  httpStatus: string;
  reason: string;
  message: string;
  data: {
    [key: string]: any;
  };
}
