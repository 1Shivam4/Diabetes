import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../config.env') });

import fs from 'fs';
import User from '../models/db.usersModal.js';
import mongoose from "mongoose";

const db = process.env.DATABASE.replace(
    '<db_password>',
    process.env.DATABASE_PASSWORD
)

mongoose.connect(db).then(con=>{
    console.log('DB connections successful.')
})

// admin Password = cbfreelance@2025
const adminData = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'))

const importData = async () => {
    try {
      await User.create(adminData, { validateBeforeSave: false });
      console.log('Data successfully loaded');
      process.exit();
    } catch (e) {
      console.log(e);
    }
  };
const deleteData = async ()=>{
    try{
        // await User.deleteMany({role:'admin'})
        await User.deleteMany();
        console.log('Users has been deleted')
        process.exit()
    }catch(e){
        console.log(e)
    }
}

if(process.argv[2]==='--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData()
}

console.log(process.argv)