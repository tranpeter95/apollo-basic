import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose, {connect} from 'mongoose'
import Book from '../models/book.js';
import dotenv from "dotenv";

dotenv.config()

const mongoURI = process.env.MONGOURI;

const typeDefs = `#graphql
  type Book {
    _id : String
    author: String
    title: String
    year: Int
  }

  input BookInput {
    author: String
    title: String
    year: Int
  }

  type Query {
    getBook(ID: ID!): Book!
    getBooks(limit: Int): [Book]
  }

  type Mutation {
    createBook(bookInput: BookInput): String!
    updateBook(ID: ID!, bookInput: BookInput): String!
    deleteBook(ID: ID!): String!
  }
`

const resolvers = {
  Query: {
    async getBook(_parent, { ID }) {
      return await Book.findById(ID);
    },
    async getBooks(_parent, {limit}) {
      return await Book.find().limit(limit)
    }
  },
  Mutation: {
    async createBook(_parent, {bookInput: { author, title, year} }) {
      const res = await Book.create({author, title, year});
      return res._id;
    },
    async updateBook(_parent, {ID, bookInput: {author, title, year}}) {
      await Book.updateOne({_id: ID}, {author, title, year});
      return ID;
    },
    async deleteBook(_parent, {ID}) {
      await Book.deleteOne({_id: ID});
      return ID;
    }
  }
}

connect(mongoURI);

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const {url} = await startStandaloneServer(server, {
  listen: {port:4000}
})

console.log(`Server listening at ${url}`)