import { MenuModel } from '../../src/models/menu';
import { MenuItemModel } from '../../src/models/menuitem';
import { MenuController } from '../../src/controller/menu';
import {
    DefaultError,
    NotFoundError,
    InvalidInputError,
} from '../../src/shared/error';
import { MenuDTO, MenuItemDto, OrderItemDTO } from '../../src/shared/types';
import { OrderItemModel } from '../../src/models/orderitem';
import mongoose from 'mongoose';
jest.mock('../../src/models/menu');
jest.mock('../../src/models/menuitem');
jest.mock('../../src/shared/helper', () => ({
    isValidUUID: jest.fn(),
}));
describe('MenuController', () => {
    let menuController;

    beforeEach(() => {
        menuController = new MenuController();
        const { isValidUUID } = require('../../src/shared/helper');
        isValidUUID.mockReturnValue(true);
    });

    describe('addMenuItem', () => {
        it('should add a new menu item and return its details', async () => {
            const mockMenuItem = {
                menuItem_id: '1',
                name: 'Burger',
                description: 'Delicious burger',
                price: 10,
                imageUrl: 'http://example.com/burger.jpg',
            };

            MenuItemModel.prototype.save = jest
                .fn()
                .mockResolvedValue(mockMenuItem);

            const result = await menuController.addMenuItem(
                'Burger',
                'Delicious burger',
                10,
                'http://example.com/burger.jpg'
            );

            expect(result).toEqual(
                new MenuItemDto(
                    '1',
                    'Burger',
                    'Delicious burger',
                    10,
                    'http://example.com/burger.jpg'
                )
            );
            expect(MenuItemModel.prototype.save).toHaveBeenCalled();
        });
    });

    describe('addMenu', () => {
        it('should throw an error if menu type is invalid', async () => {
            const mockMenu = {
                _id: 'menu1',
                startTime: '10:00',
                endTime: '22:00',
                menuItems: ['1'],
            };
            const mockMenuItem = {
                menuItem_id: '1',
                name: 'Burger',
                description: 'Delicious burger',
                price: 10,
                imageUrl: 'http://example.com/burger.jpg',
            };

            menuController.getMenuItem = jest
                .fn()
                .mockResolvedValue(mockMenuItem);
            MenuModel.prototype.save = jest.fn().mockResolvedValue(mockMenu);
            MenuModel.deleteOne = jest.fn();

            await expect(
                menuController.addMenu('10:00', '22:00', ['1'])
            ).rejects.toThrow('invalid time format or time range');
        });

        it('should add a new menu and return its details', async () => {
            const mockMenuItem = new MenuItemDto(
                '1',
                'Burger',
                'Delicious burger',
                10,
                'http://example.com/burger.jpg'
            );

            menuController.getMenuItem = jest
                .fn()
                .mockResolvedValue(mockMenuItem);

            const mockMenu = {
                _id: 'menu1',
                startTime: '10:00',
                endTime: '22:00',
                menuItems: ['1'],
                type: 'Lunch',
            };

            MenuModel.prototype.save = jest.fn().mockResolvedValue(mockMenu);
            MenuModel.prototype.type = 'Lunch';
            MenuModel.deleteOne = jest.fn();

            const result = await menuController.addMenu('10:00', '22:00', [
                '1',
            ]);

            expect(result).toEqual(
                new MenuDTO('Lunch', [
                    new MenuItemDto(
                        '1',
                        'Burger',
                        'Delicious burger',
                        10,
                        'http://example.com/burger.jpg'
                    ),
                ])
            );
            expect(MenuModel.prototype.save).toHaveBeenCalled();
        });
    });

    describe('getMenuItem', () => {
        it('should throw an error if menu item ID is invalid', async () => {
            const { isValidUUID } = require('../../src/shared/helper');
            isValidUUID.mockReturnValue(false);

            await expect(
                menuController.getMenuItem('invalid-id')
            ).rejects.toThrow(InvalidInputError);
        });

        it('should throw DefaultError on database error', async () => {
            // Mock getMenuItem method to throw an error
            MenuItemModel.find = jest
                .fn()
                .mockRejectedValue(new DefaultError(500, 'Database Error'));

            // Mock parameters
            const menuItemId = 'mock_menu_item_id';
            const quantity = 2;

            // Call the method and expect it to throw an error
            await expect(
                menuController.addOrderItem(menuItemId, quantity)
            ).rejects.toThrow(DefaultError);
        });

        it('should throw an error if menu item is not found', async () => {
            MenuItemModel.findOne = jest.fn().mockResolvedValue(null);

            await expect(menuController.getMenuItem('1')).rejects.toThrow(
                NotFoundError
            );
        });

        it('should return the menu item details', async () => {
            const mockMenuItem = new MenuItemDto(
                '1',
                'Burger',
                'Delicious burger',
                10,
                'http://example.com/burger.jpg'
            );

            menuController.getMenuItem = jest
                .fn()
                .mockResolvedValue(mockMenuItem);

            const result = await menuController.getMenuItem('1');

            expect(result).toEqual(
                new MenuItemDto(
                    '1',
                    'Burger',
                    'Delicious burger',
                    10,
                    'http://example.com/burger.jpg'
                )
            );
        });
    });

    describe('getMenuItems', () => {
        it('should throw an error if menu ID is invalid', async () => {
            const { isValidUUID } = require('../../src/shared/helper');
            isValidUUID.mockReturnValue(false);

            await expect(
                menuController.getMenuItems('invalid-id')
            ).rejects.toThrow(InvalidInputError);
        });

        it('should throw DefaultError on database error', async () => {
            // Mock getMenuItem method to throw an error
            menuController.getMenuItem = jest
                .fn()
                .mockRejectedValue(new DefaultError(500, 'Database Error'));

            // Mock parameters
            const menuItemId = 'mock_menu_item_id';
            const quantity = 2;

            // Call the method and expect it to throw an error
            await expect(
                menuController.addOrderItem(menuItemId, quantity)
            ).rejects.toThrow(DefaultError);
        });

        it('should throw an error if menu is not found', async () => {
            MenuModel.findOne = jest.fn().mockResolvedValue(null);

            await expect(menuController.getMenuItems('menu1')).rejects.toThrow(
                NotFoundError
            );
        });

        it('should return the list of menu items', async () => {
            const mockMenu = {
                menu_id: 'menu1',
                menuItems: ['1'],
            };

            const mockMenuItem = new MenuItemDto(
                '1',
                'Burger',
                'Delicious burger',
                10,
                'http://example.com/burger.jpg'
            );

            MenuModel.findOne = jest.fn().mockResolvedValue(mockMenu);
            menuController.getMenuItem = jest
                .fn()
                .mockResolvedValue(mockMenuItem);

            const result = await menuController.getMenuItems('menu1');

            expect(result).toEqual([
                new MenuItemDto(
                    '1',
                    'Burger',
                    'Delicious burger',
                    10,
                    'http://example.com/burger.jpg'
                ),
            ]);
        });
    });

    describe('getActiveMenu', () => {
        it('should throw an error if no active menu is found', async () => {
            let originalDb = mongoose.connection.db;

            // Mock the db object
            Object.defineProperty(mongoose.connection, 'db', {
                value: {
                    command: jest.fn(),
                },
                writable: true,
            });
            const mockResult = {
                localTime: new Date(),
            };

            // Set up the mock implementation
            mongoose.connection.db.command = jest
                .fn()
                .mockResolvedValue(mockResult);

            MenuModel.find = jest.fn().mockResolvedValue([]);
            await expect(menuController.getActiveMenu()).rejects.toThrow(
                NotFoundError
            );
            Object.defineProperty(mongoose.connection, 'db', {
                value: originalDb,
                writable: true,
            });
        });

        it('should throw DefaultError on database error', async () => {
            // Mock getMenuItem method to throw an error
            menuController.getMenuItem = jest
                .fn()
                .mockRejectedValue(new DefaultError(500, 'Database Error'));

            // Mock parameters
            const menuItemId = 'mock_menu_item_id';
            const quantity = 2;

            // Call the method and expect it to throw an error
            await expect(
                menuController.addOrderItem(menuItemId, quantity)
            ).rejects.toThrow(DefaultError);
        });

        it('should return the active menu', async () => {
            let originalDb = mongoose.connection.db;

            // Mock the db object
            Object.defineProperty(mongoose.connection, 'db', {
                value: {
                    command: jest.fn(),
                },
                writable: true,
            });
            const mockResult = {
                localTime: new Date(),
            };

            // Set up the mock implementation
            mongoose.connection.db.command = jest
                .fn()
                .mockResolvedValue(mockResult);
            const mockMenu = [
                {
                    menu_id: 'menu1',
                    startTime: '10:00',
                    endTime: '22:00',
                    menuItems: ['1'],
                    type: 'Lunch',
                },
            ];
            mockMenu[0].menu_id = mockMenu[0]['menu_id'];

            const mockMenuItem = new MenuItemDto(
                '1',
                'Burger',
                'Delicious burger',
                10,
                'http://example.com/burger.jpg'
            );

            MenuModel.find = jest.fn().mockResolvedValue(mockMenu);
            menuController.getMenuItems = jest
                .fn()
                .mockResolvedValue([mockMenuItem]);

            const result = await menuController.getActiveMenu();

            expect(result).toEqual(
                new MenuDTO('Lunch', [
                    new MenuItemDto(
                        '1',
                        'Burger',
                        'Delicious burger',
                        10,
                        'http://example.com/burger.jpg'
                    ),
                ])
            );
            Object.defineProperty(mongoose.connection, 'db', {
                value: originalDb,
                writable: true,
            });
        });
    });

    describe('addOrderItem', () => {
        it('should throw DefaultError on database error', async () => {
            // Mock getMenuItem method to throw an error
            menuController.getMenuItem = jest
                .fn()
                .mockRejectedValue(new DefaultError(500, 'Database Error'));

            // Mock parameters
            const menuItemId = 'mock_menu_item_id';
            const quantity = 2;

            // Call the method and expect it to throw an error
            await expect(
                menuController.addOrderItem(menuItemId, quantity)
            ).rejects.toThrow(DefaultError);
        });

        it('should add an order item successfully', async () => {
            // Mock getMenuItem method
            const mockMenuItem = new MenuItemDto(
                'mock_menu_item_id',
                'Mock Menu Item',
                'Mock Description',
                10.99,
                'mock_image_url'
            );
            menuController.getMenuItem = jest
                .fn()
                .mockResolvedValue(mockMenuItem);

            // Mock parameters
            const menuItemId = 'mock_menu_item_id';
            const quantity = 2;
            OrderItemModel.prototype.save = jest
                .fn()
                .mockResolvedValue({ mockMenuItem, quantity });

            // Call the method
            const result = await menuController.addOrderItem(
                menuItemId,
                quantity
            );

            expect(result).toEqual(
                expect.objectContaining(
                    new OrderItemDTO(mockMenuItem, quantity)
                )
            );
        });
    });

    describe('getOrderItem', () => {
        it('should throw InvalidInputError if menuItemId is invalid or null', async () => {
            const { isValidUUID } = require('../../src/shared/helper');
            isValidUUID.mockReturnValue(false);
            const invalidId = '';

            await expect(
                menuController.getOrderItem(invalidId)
            ).rejects.toThrow(InvalidInputError);
        });

        it('should throw DefaultError on database error', async () => {
            // Mock getMenuItem method to throw an error
            OrderItemModel.find = jest
                .fn()
                .mockRejectedValue(new DefaultError(500, 'Database Error'));

            // Mock parameters
            const menuItemId = 'mock_menu_item_id';
            const quantity = 2;

            // Call the method and expect it to throw an error
            await expect(
                menuController.addOrderItem(menuItemId, quantity)
            ).rejects.toThrow(DefaultError);
        });

        it('should throw NotFoundError if no order items are found', async () => {
            OrderItemModel.find = jest.fn().mockResolvedValue([]);
            const validId = '1';

            await expect(menuController.getOrderItem(validId)).rejects.toThrow(
                NotFoundError
            );
        });

        it('should return OrderItemDTO if order items are found', async () => {
            const orderItems = [
                {
                    menuItem: {
                        menuItemId: '1',
                        name: 'Burger',
                        description: 'A delicious burger',
                        price: 9.99,
                        imageUrl: 'http://example.com/burger.jpg',
                    },
                    quantity: 2,
                },
                {
                    menuItem: {
                        menuItemId: '1',
                        name: 'Burger',
                        description: 'A delicious burger',
                        price: 9.99,
                        imageUrl: 'http://example.com/burger.jpg',
                    },
                    quantity: 3,
                },
            ];
            OrderItemModel.find = jest.fn().mockResolvedValue(orderItems);
            const expectedMenuItem = new MenuItemDto(
                '1',
                'Burger',
                'A delicious burger',
                9.99,
                'http://example.com/burger.jpg'
            );
            const expectedResult = new OrderItemDTO(expectedMenuItem, 5);

            const result = await menuController.getOrderItem('1');
            expect(result).toEqual(expectedResult);
        });
    });
});
