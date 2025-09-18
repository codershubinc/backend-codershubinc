import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document & {
    createdAt: Date;
    updatedAt: Date;
};

@Schema({
    timestamps: true, // Automatically adds createdAt and updatedAt fields
})
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    phoneNumber?: string;

    @Prop()
    avatar?: string;

    @Prop({ default: Date.now })
    lastLoginAt?: Date;

    @Prop([String])
    roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ firstName: 1, lastName: 1 });