import { Schema, model } from "mongoose";
const BookSchema = new Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: String, required: true },
});
const Book = model('books', BookSchema);
export default Book;
