import {
  addCat,
  deleteCat,
  getAllCats,
  getCat,
  updateCat,
} from '../models/catModel';
import {Request, Response, NextFunction} from 'express';
import {Cat, PostCat} from '../../interfaces/Cat';
import {User} from '../../interfaces/User';
import CustomError from '../../classes/CustomError';
import {validationResult} from 'express-validator';
import MessageResponse from '../../interfaces/MessageResponse';

const catListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cats = await getAllCats();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catGet = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_get validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const cat = await getCat(req.params.id);
    res.json(cat);
  } catch (error) {
    next(error);
  }
};

// TODO: create catPost function to add new cat Done
// catPost should use addCat function from catModel
// catPost should use validationResult to validate req.body
// catPost should use req.file to get filename
// catPost should use res.locals.coords to get lat and lng (see middlewares.ts)
// catPost should use req.user to get user_id and role

const catPost = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const cat: PostCat = req.body;
    console.log(req.file, res.locals.coords[0], res.locals.coords.lng);
    cat.filename = <string>req.file?.filename;
    cat.lat = res.locals.coords[0];
    cat.lng = res.locals.coords[1];
    cat.owner = (req.user as User).user_id;
    const result = await addCat(cat);
    if (result) {
      const message: MessageResponse = {
        message: 'cat added',
        id: result,
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};
const catPut = async (
  req: Request<{id: string}, {}, Cat>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_put validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = parseInt(req.params.id);
    const cat = req.body;
    const result = await updateCat(
      cat,
      id,
      (req.user as User).user_id,
      (req.user as User).role
    );
    if (result) {
      const message: MessageResponse = {
        message: 'cat updated',
        id,
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

// TODO: create catDelete function to delete cat Done
// catDelete should use deleteCat function from catModel
// catDelete should use validationResult to validate req.params.id
const catDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_deleted validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const id = parseInt(req.params.id);
    const result = await deleteCat(id);
    if (result) {
      const message: MessageResponse = {
        message: 'cat deleted',
        id,
      };
      res.json(message);
    }
  } catch (error) {
    next(error);
  }
};

export {catListGet, catGet, catPost, catPut, catDelete};
