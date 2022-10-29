// - An interface that describes data
//   that will be stored in the database is a model
// - Interfaces are a feature of Typescript and will not get transpiled
export default interface IUser {
  name: string,
  email: string,
  password?: string,
  age:number,
  phoneNumber: string
}

// - A class will get transpiled
// - Can add business logic (methods) to the class to handle data
// - Start with interface then move to class when business logic is needed
// export default class IUser {
//   Cname?: string
//   Cemail?: string
//   Cpassword?: string
//   Cage?:number
//   CphoneNumber?: string
// }
