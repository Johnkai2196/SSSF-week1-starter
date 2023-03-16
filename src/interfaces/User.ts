import {RowDataPacket} from 'mysql2';
interface User {
  user_id: number;
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

// TODO: create interface GetUser that extends RowDataPacket and User. Done
interface GetUser extends RowDataPacket, User {}

// TODO create interface PostUser that extends User but without id. Done
type PostUser = Omit<User, 'user_id'>;
// TODO create interface PutUser that extends PostUser but all properties are optional. Done
// type PutUser = Partial<PostUser>;
interface PutUser extends Partial<PostUser> {}
export {User, GetUser, PostUser, PutUser};
