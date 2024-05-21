export class Product {
    constructor(public readonly name: string) {
    }
}

export type ProductGroup = {product: Product, quantity: number, basePrice: number}