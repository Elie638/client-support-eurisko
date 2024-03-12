import { Schema, model } from 'mongoose';
import { categoryCollection, complaintCollection, userCollection } from '../configs/configs';

const complaintSchema = new Schema({
    title: String,
    body: String,
    categoriesId: [{
        type: Schema.Types.ObjectId,
        ref: categoryCollection
    }],
    status: {
        type: String,
        enum: ['PENDING', 'INPROGRESS', 'RESOLVED', 'REJECTED'],
        default: 'PENDING',
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: userCollection
    }
})

export default model(complaintCollection, complaintSchema);