import { expect } from './expect';
import { Checkout, Product, ProductCatalogue } from '../src';
import {
    BuyToGetFreeItemsDiscount,
    Discount,
    FixedDiscount,
    PercentageDiscount,
    PercentageDiscountAboveQuantityThreshold
} from "../src/Discount";

describe('Checking out articles at the supermarket', () => {

    const
        Apples   = new Product('Apples'),
        Bananas  = new Product('Lemons'),
        Coffee   = new Product('Coffee'),
        Rice     = new Product('Rice');

    const catalogue = new ProductCatalogue();

    beforeEach(() => {
        catalogue.setPriceOf(Apples,  2.00);
        catalogue.setPriceOf(Bananas, 1.50);
        catalogue.setPriceOf(Rice,    2.70);
        catalogue.setPriceOf(Coffee,  4.50);
    });

    afterEach(() => catalogue.reset());

    describe(`The receipt`, () => {

        it(`should show the total price of £0 when the shopping cart is empty`, () => {
            const checkout = new Checkout(catalogue);

            const receipt = checkout.scan([
                /* no products in the basket */
            ]);

            expect(receipt.totalPrice()).to.equal(0);
        });

        describe(`with no special offers`, () => {

            it(`should show the total price equal to the total price of individual items`, () => {
                const checkout = new Checkout(catalogue);

                const receipt = checkout.scan([
                    Apples,
                ]);

                expect(receipt.totalPrice()).to.equal(2.00);
            });

            it(`should show the quantity and a total price per product type`, () => {
                const checkout = new Checkout(catalogue);

                const receipt = checkout.scan([
                    Apples,
                    Apples,
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(2);
                expect(lineItem.totalPrice).to.equal(2 * 2.00);
            })
        });

        describe(`with "fixed discount" offer`, () => {
            it(`should set the new product price to the lower one `, () => {
                const fixedDiscount = new FixedDiscount([Apples], 1.5)

                const checkout = new Checkout(catalogue, [fixedDiscount]);

                const receipt = checkout.scan([
                    Apples,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(1);
                expect(lineItem.totalPrice).to.equal(1.5);
                expect(receipt.totalPrice()).to.equal(1.5 + 1.5)
            })

            it(`should apply the new price multiple times`, () => {
                const fixedDiscount = new FixedDiscount([Apples, Bananas], 1)

                const checkout = new Checkout(catalogue, [fixedDiscount]);

                const receipt = checkout.scan([
                    Apples,
                    Apples,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(2);
                expect(lineItem.totalPrice).to.equal(2);
                expect(receipt.totalPrice()).to.equal(3)
            })

        });

        describe(`with "Buy 2 get 1 free" offer`, () => {
            it(`should be the price of 2 when 3 are bought`, () => {
                const buyTwoGetOneFreeOffer = new BuyToGetFreeItemsDiscount([Apples], 2, 1)

                const checkout = new Checkout(catalogue, [buyTwoGetOneFreeOffer]);

                const receipt = checkout.scan([
                    Apples,
                    Apples,
                    Apples,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(3);
                expect(lineItem.totalPrice).to.equal(4);
                expect(receipt.totalPrice()).to.equal(5.5)
            })

            it(`should be the price of 5 when 7 are bought`, () => {
                const buyTwoGetOneFreeOffer = new BuyToGetFreeItemsDiscount([Apples], 2, 1)

                const checkout = new Checkout(catalogue, [buyTwoGetOneFreeOffer]);

                const receipt = checkout.scan([
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Bananas,
                    Bananas,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(7);
                expect(lineItem.totalPrice).to.equal(2 * 5);
                expect(receipt.totalPrice()).to.equal(2 * 5 + 1.5 * 3)
            })

        });

        describe(`with "Buy 4 get 1 free" offer`, () => {
            it(`should be the price of 4 when 5 are bought`, () => {
                const buyFourGetOneFreeDiscount = new BuyToGetFreeItemsDiscount([Apples], 4, 1)

                const checkout = new Checkout(catalogue, [buyFourGetOneFreeDiscount]);

                const receipt = checkout.scan([
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(5);
                expect(lineItem.totalPrice).to.equal(4 * 2);
                expect(receipt.totalPrice()).to.equal(4 * 2 + 1.5)
            })

            it(`should be the price of 9 when 11 are bought`, () => {
                const buyFourGetOneFreeDiscount = new BuyToGetFreeItemsDiscount([Apples], 4, 1)

                const checkout = new Checkout(catalogue, [buyFourGetOneFreeDiscount]);

                const receipt = checkout.scan([
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(11);
                expect(lineItem.totalPrice).to.equal(2 * 9);
                expect(receipt.totalPrice()).to.equal(2 * 9 + 1.5 * 5)
            })

        });

        describe(`with "10% discount" offer`, () => {
            it(`Applicable items should be 10% off`, () => {
                const tenPercentDiscount = new PercentageDiscount([Apples], 0.1)

                const checkout = new Checkout(catalogue, [tenPercentDiscount]);

                const receipt = checkout.scan([
                    Apples,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(1);
                expect(lineItem.totalPrice).to.equal(2 * .9);
                expect(receipt.totalPrice()).to.equal(2 * .9 + 1.5)
            })

            it(`should apply percentage discount multiple times`, () => {
                const tenPercentDiscount = new PercentageDiscount([Apples, Bananas], 0.1)

                const checkout = new Checkout(catalogue, [tenPercentDiscount]);

                const receipt = checkout.scan([
                    Apples,
                    Apples,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(2);
                expect(lineItem.totalPrice).to.equal(2 * 2 * 0.9);
                expect(receipt.totalPrice()).to.equal(2 * 2 * 0.9 + 1.5 * 0.9)
            })
        });

        describe(`with "20% discount when you buy more than 10" offer`, () => {
            it(`Items should not be discounted if not on offer or 10 or less`, () => {
                const twentyPercentOffOverTenItems = new PercentageDiscountAboveQuantityThreshold([Apples], 0.2, 10)

                const checkout = new Checkout(catalogue, [twentyPercentOffOverTenItems]);

                const receipt = checkout.scan([
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(10);
                expect(lineItem.totalPrice).to.equal(2 * 10);
                expect(receipt.totalPrice()).to.equal(2 * 10 + 1.5 * 11)
            })

            it(`Items should be discounted if on offer and more than 10 bought`, () => {
                const twentyPercentOffOverTenItems = new PercentageDiscountAboveQuantityThreshold([Apples], 0.2, 10)

                const checkout = new Checkout(catalogue, [twentyPercentOffOverTenItems]);


                const receipt = checkout.scan([
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Apples,
                    Bananas
                ]);

                const lineItem = receipt.lineItems[0];

                expect(lineItem).to.not.be.undefined;

                expect(lineItem.product.name).to.equal(Apples.name);
                expect(lineItem.quantity).to.equal(11);
                expect(lineItem.totalPrice).to.equal(2 * 11 * 0.8);
                expect(receipt.totalPrice()).to.equal(2 * 11 * 0.8 + 1.5)
            })

        });
    });
});
