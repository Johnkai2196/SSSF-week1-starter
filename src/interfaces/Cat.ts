import {RowDataPacket} from 'mysql2';
import {User} from './User';
interface Cat {
  // TODO: create a cat interface. Done
  // owner should be a User or a number
  cat_id: number;
  cat_name: string;
  owner: User | number;
  weight: number;
  filename: string;
  birthdate: string;
  lat: number;
  lng: number;
}

interface GetCat extends RowDataPacket, Cat {}

// TODO: create PostCat interface. Same as cat but without id. Done
type PostCat = Omit<Cat, 'id'>;
// TODO: create PutCat interface. Same as PostCat but properties are optional. Done
type PutCat = Partial<PostCat>;

export {Cat, GetCat, PostCat, PutCat};
