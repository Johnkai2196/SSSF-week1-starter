import {promisePool} from '../../database/db';
import CustomError from '../../classes/CustomError';
import {ResultSetHeader} from 'mysql2';
import {GetUser, PostUser, PutUser, User} from '../../interfaces/User';

const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await promisePool.execute<GetUser[]>(
    `
    SELECT user_id, user_name, email, role 
    FROM sssf_user
    `
  );
  if (rows.length === 0) {
    throw new CustomError('No users found', 404);
  }
  return rows;
};

const getUser = async (userId: string): Promise<User> => {
  const [rows] = await promisePool.execute<GetUser[]>(
    `
    SELECT user_id, user_name, email, role 
    FROM sssf_user 
    WHERE user_id = ?;
    `,
    [userId]
  );
  if (rows.length === 0) {
    throw new CustomError('No users found', 404);
  }
  return rows[0];
};

// TODO: create addUser function done
const addUser = async (data: PostUser): Promise<number> => {
  const [headers] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO sssf_user (user_name, email, password) VALUES (?, ?, ?);',
    [data.user_name, data.email, data.password]
  );
  if (headers.affectedRows === 0) {
    throw new CustomError('Could not add user', 500);
  }
  return headers.insertId;
};

const updateUser = async (data: PutUser, userId: number): Promise<boolean> => {
  const sql = promisePool.format('UPDATE sssf_user SET ? WHERE user_id = ?;', [
    data,
    userId,
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('No users updated', 400);
  }
  return true;
};

// TODO: create deleteUser function done
const deleteUser = async (userId: number): Promise<boolean> => {
  const sql = promisePool.format('DELETE FROM sssf_user WHERE user_id = ?;', [
    userId,
  ]);
  const [headers] = await promisePool.execute<ResultSetHeader>(sql);
  if (headers.affectedRows === 0) {
    throw new CustomError('No users deleted', 400);
  }
  return true;
};

const getUserLogin = async (email: string): Promise<User> => {
  const [rows] = await promisePool.execute<GetUser[]>(
    `
    SELECT * FROM sssf_user 
    WHERE email = ?;
    `,
    [email]
  );
  if (rows.length === 0) {
    throw new CustomError('Invalid username/password', 200);
  }
  return rows[0];
};

export {getAllUsers, getUser, addUser, updateUser, deleteUser, getUserLogin};
