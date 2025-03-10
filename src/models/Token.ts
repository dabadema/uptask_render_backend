import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IToken extends Document {
    token: string;
    userId: Types.ObjectId;
    createdAt: Date;
}

const tokenSchema = new Schema({
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, default: Date.now, expires: '10m' },
});

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
