import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query as ExpressQuery } from 'express-serve-static-core';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/users/users.schema';
import { CreateBookDto, UpdateBookDto } from './book.dto';
import { Book } from './book.schema';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async getBooks(query: ExpressQuery): Promise<Book[]> {
    const { page, limit, title } = query;
    const perPage: number = limit ? Number(limit) : 10;
    const currentPage: number = page ? Number(page) : 1;
    const skip = (currentPage - 1) * perPage;
    const search = title
      ? {
          title: {
            $regex: title,
            $options: 'i',
          },
        }
      : {};
    return this.bookModel
      .find({ ...search })
      .limit(perPage)
      .skip(skip);
  }
  async createBook(book: CreateBookDto, user: User): Promise<Book> {
    return this.bookModel.create({ ...book, user: user._id });
  }

  async getBookById(id: string): Promise<Book> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Invalid Id');
    }
    const books = await this.bookModel.findOne({ _id: id });
    if (!books) {
      throw new NotFoundException('Book Not Found');
    }
    return books;
  }
  async updateBookById(id: string, book: UpdateBookDto): Promise<Book> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Invalid Id');
    }
    return this.bookModel.findByIdAndUpdate({ _id: id }, book, { new: true });
  }

  async deleteBookById(id: string): Promise<Book> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) {
      throw new BadRequestException('Invalid Id');
    }
    return this.bookModel.findByIdAndDelete({ _id: id });
  }
}
