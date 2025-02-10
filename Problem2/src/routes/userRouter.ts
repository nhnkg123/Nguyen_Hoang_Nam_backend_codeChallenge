import express, { Request, response, Response, Router } from 'express';
import {Repository} from '../Repository/Repository';
import {IUser, User} from '../Models/UserModel'
import { ObjectId} from "mongodb";

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    const repo = new Repository<IUser>('users', 'users');
    repo.getAll().then(result => {
        res.send(result);
    });
});

router.get('/:id', (req:Request, res:Response) => {
    const id =  req.params.id;
    const repo = new Repository<IUser>('users', 'users');
    repo.getByID(id).then(result => {
        res.send(result);
    })
});

router.post('/create', (rep:Request, res:Response) => {
    const objectId = new ObjectId();
    const name = rep.body.name;
    const password = rep.body.password;
    const phoneNumber = rep.body.phoneNumber;
    const newUser = new User(objectId, name, password, phoneNumber);

    const repo = new Repository<IUser>('users', 'users');
    repo.create(newUser).then(result => {
        res.send(result);
    })
})

router.delete('/:id', (req:Request, res:Response) => {
    const id = req.params.id;
    const repo = new Repository<IUser>('users', 'users');
    repo.delete(id).then(result => {
        if (result) {
            res.send("Delete successfully.");
        } else {
            res.send("Unable to delete user.Try again");
        }
    })
})

export default router;