import express, { Request, response, Response, Router } from 'express';
import {Repository} from '../Repository/Repository';
import {IUser, User} from '../Models/UserModel'
import { ObjectId} from "mongodb";

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    const keyword = req.params.keyword;
    const repo = new Repository<IUser>('users', 'users');
    repo.getAll({ name: { $regex: `${keyword}`, $options: "i" } }).then(users => {
        res.json(users);
    });
});

router.get('/:id', (req:Request, res:Response) => {
    const id =  req.params.id;
    const repo = new Repository<IUser>('users', 'users');
    repo.getByID(id).then(user => {
        res.json(user);
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
        res.status(201).json({
            newUser: result,
            message: "User created successfully"
        });
    })
})

router.put('/save/:id', (rep:Request, res:Response) => {
    const repo = new Repository<IUser>('users', 'users');

    const id = rep.params.id;
    const updatedName = rep.body.name;
    const updatedPassword = rep.body.password;
    const updatedPhoneNumber = rep.body.phoneNumber;

    repo.getAll().then(users => {
        const existingUser = users.find(user => user._id.toString() === id);
        if (existingUser) {
            existingUser.name = updatedName;
            existingUser.password = updatedPassword;
            existingUser.phoneNumber = updatedPhoneNumber;

            repo.save(existingUser).then(result => {
                res.status(201).json({
                    message: "User saved successfully"
                })
            });
        } else {
            res.status(404).json({message: "User not found."});
        }
    }); 
})

router.delete('/delete/:id', (req:Request, res:Response) => {
    const id = req.params.id;
    const repo = new Repository<IUser>('users', 'users');
    repo.delete(id).then(result => {
        if (result) {
            res.status(201).json({message: "Delete successfully."});
        } else {
            res.status(404).json({message: "User not found"});
        }
    })
})

export default router;