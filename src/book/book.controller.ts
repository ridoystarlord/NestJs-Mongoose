import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CreateBookDto, UpdateBookDto } from './book.dto';
import { Book } from './book.schema';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async GetBooks(@Query() query: ExpressQuery): Promise<Book[]> {
    return this.bookService.getBooks(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async CreateBook(@Body() book: CreateBookDto, @Req() req): Promise<Book> {
    return this.bookService.createBook(book, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async GetBookById(@Param('id') id: string): Promise<Book> {
    return this.bookService.getBookById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async UpdateBookById(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.updateBookById(id, book);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async DeleteBookById(@Param('id') id: string): Promise<Book> {
    return this.bookService.deleteBookById(id);
  }
}
