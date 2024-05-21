import {Product, ProductGroup} from "./Product";

export abstract class Discount {
    abstract getDiscountedTotalPrice(productGroup: ProductGroup): number
}


export class FixedDiscount extends Discount {
    applicableProducts: Product[]
    newPrice: number
    constructor(products: Product[], newPrice: number) {
        super();
        this.applicableProducts = products
        this.newPrice = newPrice
    }

    getDiscountedTotalPrice(productGroup: ProductGroup): number {
        if (this.applicableProducts.includes(productGroup.product)) {
            return this.newPrice * productGroup.quantity
        }
        return productGroup.basePrice * productGroup.quantity
    }

}

export class BuyToGetFreeItemsDiscount extends Discount {
    applicableProducts: Product[]
    numberNeededToBuy: number
    numberToGetForFree: number

    constructor(applicableProducts: Product[], numberNeededToBuy: number, numberToGetForFree: number) {
        super();
        this.applicableProducts = applicableProducts
        this.numberNeededToBuy = numberNeededToBuy
        this.numberToGetForFree = numberToGetForFree
    }

    getDiscountedTotalPrice(productGroup: ProductGroup): number {
        if (this.applicableProducts.includes(productGroup.product)) {
            const numberOfItemsNotInOffer = productGroup.quantity % (this.numberNeededToBuy + this.numberToGetForFree)
            const numberOfTimesOfferApplied = (productGroup.quantity - numberOfItemsNotInOffer) / (this.numberNeededToBuy + this.numberToGetForFree)
            const totalPriceOfItemsInOffer = numberOfTimesOfferApplied * this.numberNeededToBuy * productGroup.basePrice
            return totalPriceOfItemsInOffer + numberOfItemsNotInOffer * productGroup.basePrice
        }
        return productGroup.basePrice * productGroup.quantity
    }
}

export class PercentageDiscount extends Discount {
    applicableProducts: Product[]
    percentageOffDecimal: number
    constructor(applicableProducts: Product[], percentageOffDecimal: number) {
        super();
        this.applicableProducts = applicableProducts
        this.percentageOffDecimal = percentageOffDecimal
    }

    getDiscountedTotalPrice(productGroup: ProductGroup): number {
        if (this.applicableProducts.includes(productGroup.product)) {
            return productGroup.basePrice * productGroup.quantity * (1 - this.percentageOffDecimal)
        }
        return productGroup.basePrice * productGroup.quantity
    }

}
export class PercentageDiscountAboveQuantityThreshold extends PercentageDiscount {
    quantityThreshold: number
    constructor(applicableProducts: Product[], percentageOffDecimal: number, quantityThreshold: number) {
        super(applicableProducts, percentageOffDecimal);
        this.quantityThreshold = quantityThreshold
    }

    getDiscountedTotalPrice(productGroup: ProductGroup): number {
        if (productGroup.quantity > this.quantityThreshold) {
            return super.getDiscountedTotalPrice(productGroup)
        }
        return productGroup.basePrice * productGroup.quantity
    }

}
