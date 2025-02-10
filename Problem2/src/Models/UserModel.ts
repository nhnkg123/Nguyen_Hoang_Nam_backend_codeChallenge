import { ObjectId} from "mongodb";

export interface IUser {
    _id: ObjectId;
    name: string;
    password: string;
    phoneNumber: string;
    created: string;
  }

export class User implements IUser
{
  _id: ObjectId;
  name: string;
  password: string;
  phoneNumber: string;
  created: string;

  constructor(_id: ObjectId, name: string, password: string, phoneNumber: string) {
    this._id = _id;
    this.name = name;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.created = new Date().toISOString();
  }
}