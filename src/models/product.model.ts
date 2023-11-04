// src/task.model.ts
import mongoose, { Document, Schema } from 'mongoose';

interface Iproduct extends Document {
  product_name:string;
  product_UniqueCode:string;
  details: Array<{
    size: string;
    quantity: number;
    price: number;
  }>;
}

const productsSchema = new Schema<Iproduct>({
  product_name: {type:String, required:true},
  product_UniqueCode:{type:String, required:true,unique:true},
  details: [
    {
      size: { type: String ,enum:["S","M","L","XL","XXL","XXXL"]},
      quantity: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
    },
  ],
});

export default mongoose.model<Iproduct>('Product', productsSchema);
