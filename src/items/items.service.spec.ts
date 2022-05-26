import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrimaryColumn } from 'typeorm';
import { UserStatus } from '../auth/user-status.enum';
import { ItemStatus } from './item-status.enum';
import { ItemRepository } from './item.repository';
import { ItemsService } from './items.service';

const mockItemRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createItem: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockUser1 = {
  id: '1',
  username: 'test1',
  password: '1234',
  status: UserStatus.PREMIUM,
};
const mockUser2 = {
  id: '2',
  username: 'test2',
  password: '5678',
  status: UserStatus.FREE,
};

describe('ItemsServiceTest', () => {
  let itemsService;
  let itemRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: ItemRepository,
          useFactory: mockItemRepository,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  describe('findAll', () => {
    it('Normal system', async () => {
      const expected = [];
      itemRepository.find.mockResolvedValue(expected);
      const result = await itemsService.findAll();

      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('Normal system', async () => {
      const expected = {
        id: 'test-item-id',
        name: 'PC',
        price: 100,
        description: '',
        status: ItemStatus.ON_SALE,
        created_at: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      itemRepository.findOne.mockResolvedValue(expected);
      const result = await itemsService.findById('test-item-id');
      expect(result).toEqual(expected);
    });

    it('Abnormal system', async () => {
      itemRepository.findOne.mockResolvedValue(null);
      await expect(itemsService.findById('test-item-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('Normal system', async () => {
      const expected = {
        id: 'test-item-id',
        name: 'PC',
        price: 100,
        description: '',
        status: ItemStatus.ON_SALE,
        created_at: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      itemRepository.createItem.mockResolvedValue(expected);
      const result = await itemsService.create({
        name: 'PC',
        price: 100,
        describe: '',
        mockUser1,
      });
      expect(result).toEqual(expected);
    });
  });

  describe('updateStatus', () => {
    const mockItem = {
      id: 'test-item-id',
      name: 'PC',
      price: 100,
      description: '',
      status: ItemStatus.ON_SALE,
      created_at: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('Normal system', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await itemsService.updateStatus('test-item-id', mockUser2);
      expect(itemRepository.save).toHaveBeenCalled();
    });
    it('Abnormal system: to by my product', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await expect(
        itemsService.updateStatus('test-item-id', mockUser1),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('updateStatus', () => {
    const mockItem = {
      id: 'test-item-id',
      name: 'PC',
      price: 100,
      description: '',
      status: ItemStatus.ON_SALE,
      created_at: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('Normal system', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await itemsService.updateStatus('test-item-id', mockUser2);
      expect(itemRepository.save).toHaveBeenCalled();
    });
    it('Abnormal system: to by my product', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await expect(
        itemsService.updateStatus('test-item-id', mockUser1),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('delete', () => {
    const mockItem = {
      id: 'test-item-id',
      name: 'PC',
      price: 100,
      description: '',
      status: ItemStatus.ON_SALE,
      created_at: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('Normal system', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await itemsService.delete('test-item-id', mockUser1);
      expect(itemRepository.delete).toHaveBeenCalled();
    });
    it('Abnormal system: delete someone product', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await expect(
        itemsService.delete('test-item-id', mockUser2),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
