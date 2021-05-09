export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  password: string;
  lastConnection: Date;
  role: string[];
  createdAt: Date;
  isDeleted: Boolean;
  email: string;
}
