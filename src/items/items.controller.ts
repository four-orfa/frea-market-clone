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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Item } from 'src/entities/item.entity';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/auth/decorator/role.decorator';
import { UserStatus } from 'src/auth/user-status.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('items')
@UseInterceptors(ClassSerializerInterceptor)
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
  @Role(UserStatus.PREMIUM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Body() createItemDto: CreateItemDto,
    @GetUser() user: User,
  ): Promise<Item> {
    return await this.itemsService.create(createItemDto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatedStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Item> {
    return await this.itemsService.updateStatus(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User): void {
    this.itemsService.delete(id, user);
  }
}
