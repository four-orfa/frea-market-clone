import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserStatus } from '../auth/user-status.enum';
import { ItemStatus } from './item-status.enum';
import { ItemRepository } from './item.repository';
import { ItemsService } from './items.service';

const mockItemRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
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
        id: 'test-id',
        name: 'PC',
        price: 100,
        description: '',
        status: ItemStatus.ON_SALE,
        created_at: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      itemRepository.findOne.mockResolvedValue(expected);
      const result = await itemsService.findById('test-id');
      expect(result).toEqual(expected);
    });

    it('Abnormal system', async () => {
      itemRepository.findOne.mockResolvedValue(null);
      await expect(itemsService.findById('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
