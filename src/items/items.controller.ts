import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { Item } from 'src/entities/item.entity';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
  @Get()
  async findAll(): Promise<Item[]> {
    return await this.itemsService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string): Promise<Item> {
    return this.itemsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return await this.itemsService.create(createItemDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatedStatus(@Param('id', ParseUUIDPipe) id: string): Promise<Item> {
    return await this.itemsService.updateStatus(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseUUIDPipe) id: string): void {
    this.itemsService.delete(id);
  }
}
