import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


export type ExchangeDocument = Exchange & Document;

@Schema()
export class Exchange {

  @Prop({ required: true })
  base: string;

  @Prop({
    type: [{target: String, rate: Number}]
  })
  rates: { target: string, rate: number }[];

}

export const ExchangeSchema = SchemaFactory.createForClass(Exchange);