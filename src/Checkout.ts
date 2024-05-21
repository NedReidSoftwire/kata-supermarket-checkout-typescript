import {Product, ProductGroup} from './Product';
import { Receipt } from './Receipt';
import { ProductCatalogue } from './ProductCatalogue';
import {Discount} from "./Discount";

export class Checkout {

    constructor(
        private readonly catalogue: ProductCatalogue,
        private readonly discounts: Discount[] = [],
    ) {
    }

    bestTotalPriceForProductGroup(productGroup: ProductGroup): number {
        const discountedTotalPrices = this.discounts.map((discount) => discount.getDiscountedTotalPrice(productGroup))
        const nonDiscountedTotalPrice = productGroup.basePrice * productGroup.quantity
        return Math.min(...discountedTotalPrices, nonDiscountedTotalPrice)
    }

    scan(products: Product[]): Receipt {
        const receipt = new Receipt();
        const individualProducts = Array.from(new Set(products));

        const productGroups: ProductGroup[] = individualProducts.map((individualProduct) => {
            const productQuantity = products.filter((product) => product === individualProduct).length
            const productBasePrice = this.catalogue.getPriceOf(individualProduct)
            return {product: individualProduct, quantity: productQuantity, basePrice: productBasePrice}
        })

        productGroups.forEach((productGroup) => {
            const totalPrice = this.bestTotalPriceForProductGroup(productGroup)
            receipt.addLineItem(productGroup.product, productGroup.quantity, totalPrice)
        })

        return receipt;
    }
}
