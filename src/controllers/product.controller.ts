// src/task.routes.ts
import { Request, Response } from 'express';

import productModel from '../models/product.model';


export const createfn = async (req: Request, res: Response) => {
  try {
    // console.log(req.body)
    const { product_name, product_UniqueCode, details } = req.body;
    if (!details) {
      res.status(400).json({ error: 'try JSON format' });

    }
    const newProduct = new productModel({
      product_name,
      product_UniqueCode,
      details
    });
    console.log(newProduct)
    const savedproduct = await newProduct.save();
    res.status(201).json(savedproduct);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const findfn = async (req: Request, res: Response) => {
  try {
    const product = await productModel.find();
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Failed to retrieve tasks' });
  }
};

export const findSelectivefn = async (req: Request, res: Response) => {
  try {
    const productUniqueCode = req.params.productUniqueCode;
    // console.log(productUniqueCode)
    const Product = await productModel.find({ product_UniqueCode: productUniqueCode });
    // console.log(Product)

    if (!Product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ data: Product }); 
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete the product' });
  }
};



export const deletefn = async (req: Request, res: Response) => {
  try {
    const { productUniqueCode } = req.params;

    const deletedProduct = await productModel.findOneAndDelete({ product_UniqueCode: productUniqueCode });
    // console.log(deletedProduct)
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ data: 'Successfully Deleted' }); 
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete the product' });
  }
};

export const updatefn = async (req: Request, res: Response) => {
  try {
    const product_UniqueCode_req = req.params.product_UniqueCode;
    // const size_req=req.query.size
    // console.log(size_req)
    const existingProduct = await productModel.findOne({ product_UniqueCode_req });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update the product details, create new details if needed
    const { product_name, product_UniqueCode, details } = req.body;

    if (product_name) {
      existingProduct.product_name = product_name;
    }

    if (details && Array.isArray(details)) {
      details.forEach((newDetail) => {
        const existingDetailIndex = existingProduct.details.findIndex(
          (existingDetail) => existingDetail.size === newDetail.size
        );

        if (existingDetailIndex !== -1) {
          // Update existing detail
          existingProduct.details[existingDetailIndex] = {
            size: newDetail.size,
            quantity: newDetail.quantity,
            price: newDetail.price,
          };
        } else {
          // Create a new detail
          existingProduct.details.push({
            size: newDetail.size,
            quantity: newDetail.quantity,
            price: newDetail.price,
          });
        }
      });
    }

    // Save the updated product
    const updatedProduct = await existingProduct.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update the product' });
  }
};

export const bulkUpdatefn= async(req: Request, res: Response)=>{
  try{
    // console.log(req.body.length)
    for(let i=0;i<req.body.length;i++){
      let data=req.body[i]["product_UniqueCode"]
      console.log(data)
      const existingProduct = await productModel.findOne({ product_UniqueCode: data });
      // console.log(existingProduct)
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Update the product details, create new details if needed
      const { product_name, product_UniqueCode, details } = req.body[i];
  
      if (product_name) {
        existingProduct.product_name = product_name;
      }
  
      if (details && Array.isArray(details)) {
        details.forEach((newDetail) => {
          const existingDetailIndex = existingProduct.details.findIndex(
            (existingDetail) => existingDetail.size === newDetail.size
          );
  
          if (existingDetailIndex !== -1) {
            // Update existing detail
            existingProduct.details[existingDetailIndex] = {
              size: newDetail.size,
              quantity: newDetail.quantity,
              price: newDetail.price,
            };
          } else {
            // Create a new detail
            existingProduct.details.push({
              size: newDetail.size,
              quantity: newDetail.quantity,
              price: newDetail.price,
            });
          }
        });
      }
  
      // Save the updated product
      const updatedProduct = await existingProduct.save();
    }
    res.status(200).json({data:`multiple update done`});


  }catch(err){
    res.status(500).json({ error: 'Failed to update the product' });
  }
}



export const checkfullfillment = async (req: Request, res: Response) => {
  try {
    const { product_UniqueCode, details } = req.body;
    // console.log(details)
    let array2 = details
    const existingProduct: any = await productModel.findOne({ product_UniqueCode: product_UniqueCode });
    // console.log(existingProduct["details"])
    let array1 = existingProduct["details"]
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    let datachecak = checkDataFulfillment(array1, array2)
    if (datachecak == true) {
      res.status(200).json({ data: 'Requirement can be fullfilled' });
    } else {
      res.status(200).json({ data: datachecak });

    }

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update the product' });
  }
}



function checkDataFulfillment(array1: [] | any, array2: [] | any): boolean | any {
  // Create a map of sizes and quantities from array1
  const sizesAndQuantities1 = new Map<string, number>();
  for (const product of array1) {
    sizesAndQuantities1.set(product.size, product.quantity);
  }

  // Iterate through array2 and check sizes and quantities
  for (const product of array2) {
    const size = product.size;
    const quantity2 = product.quantity;
    const quantity1 = sizesAndQuantities1.get(size);

    if (quantity1 === undefined) {
      // Size from array2 not found in array1
      // console.log(`${size} is not have`)
      return (`${size} is not have`);
    }

    if (quantity2 > quantity1) {
      // Quantity in array2 is greater than in array1
      // console.log(` amount is less`)
      return (`${size} amount is less`);
    }
  }

  // All sizes in array2 are present in array1, and their quantities are less than or equal
  return true;
}



export const checkLowest = async (req: Request, res: Response) => {
  try {
    // const { product_UniqueCode, details } = req.body;
    // console.log(req.body)
    let array2 = req.body
    const existingProduct: any = await productModel.find({ });
    // console.log(existingProduct)
    let array1 = existingProduct
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    let data = findLowestPrice(array1, array2)
    if (data !== null) {
      const[a,b]=[...data]
      // console.log(a,b)

      res.status(200).json({ data: `The lowest price to fulfill the requirements is: $${a.toFixed(2)} when product_uniqueCode is ${b}` });

    } else {
      res.status(200).json({ data: `The requirements cannot be fulfilled with the available products.` });
    }

  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update the product' });
  }
}

function findLowestPrice(products: [] | any, requirements: [] | any): any | null {
  let lowestPrice: number | null = null;
  let unique_code:string|null=null;
  // Iterate through each product
  for (const product of products) {
    const productDetails = new Map(product.details.map((detail: any) => [detail.size, detail]));

    // Calculate the total cost for this product based on the requirements
    let totalCost = 0;
    let requirementsFulfilled = true;

    for (const requirement of requirements) {
      const detail: any = productDetails.get(requirement.size);

      if (detail && detail.quantity >= requirement.quantity) {
        totalCost += detail.price * requirement.quantity;
      } else {
        // Requirement cannot be fulfilled with this product
        requirementsFulfilled = false;
        break;
      }
    }

    if (requirementsFulfilled) {
      if (lowestPrice === null || totalCost < lowestPrice) {
        lowestPrice = totalCost;
        unique_code=product.product_UniqueCode
      }
    }
  }

  return [lowestPrice,unique_code];
}
