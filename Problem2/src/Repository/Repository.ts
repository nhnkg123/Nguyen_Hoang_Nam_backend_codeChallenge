import {Db, Filter, MongoClient, Document, WithId, ObjectId} from "mongodb";
const dbConnectionString = process.env['MONGO_DB_CONNECTION_URI'] || '';
const dbDatabase = process.env['MONGO_DB_DATABASE'] || '';
let dbC: Db;

export interface RepositoryInterface<T extends RepositoryDocument> {
    getByID(id: string): Promise<T>;

    getAll(): Promise<Array<T>>;

    save(model: T): Promise<T>;

    create(model: T): Promise<T>;

    delete(id: string): Promise<boolean>;
}

export interface RepositoryDocument extends Document{
    _id: ObjectId;
    created: string;
}

export class Repository<T extends RepositoryDocument> {
    collectionName: string;
    modelRef: string;
    increments: boolean = true;

    constructor(collectionName: string, modelRef: string) {
        this.collectionName = collectionName;
        this.modelRef = modelRef;
    }

    public async getByID(id: string): Promise<WithId<T> | null> {
        const objectId = new ObjectId(id);
        const db = await Repository.getDb();
        return db.collection<T>(this.collectionName).findOne({_id: objectId} as Filter<T>);
    }

    public static async getDb(): Promise<Db> {
        if (!dbC) {
            const client = await MongoClient.connect(dbConnectionString);
            dbC = client.db(dbDatabase);
            console.log(`Connected to database: ${dbDatabase}`);
        }
        return dbC;
    }

    public async getAll(query?: Filter<T>): Promise<WithId<T>[]> {
        const db = await Repository.getDb();
        return db.collection<T>(this.collectionName).find(query || {}).toArray();
    }

    public async save(model: T): Promise<WithId<T> | null> {
        const db = await Repository.getDb();
        if (!model._id) {
            throw new Error('Model ID not set');
        }
        const response = await db.collection(this.collectionName).findOneAndUpdate(
            {_id: model._id},
            model
        );

        if (response && response.lastErrorObject.n === 1 && response.lastErrorObject.updatedExisting && response !== null) {
            return this.getByID(model._id.toString());
        } else {
            throw new Error('Request not found');
        }
    }

    public async create(model: T): Promise<WithId<T> | null> {
        const db = await Repository.getDb();
        const objectId = new ObjectId(model._id);
        model._id = objectId;

        model.created = new Date().toISOString();
        const response = await db.collection(this.collectionName).insertOne(model);

        if (!response) {
            throw new Error('Unable to insert');
        }

        return this.getByID(model._id.toString());
    }

    public async delete(id: string): Promise<boolean> {
        const db = await Repository.getDb();
        const objectId = new ObjectId(id);
        const response = await db.collection(this.collectionName).deleteOne({_id: objectId});

        if (!response) {
            throw new Error('Request not found');
        } else {
            return true;
        }
    }
}