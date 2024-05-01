import mongoose from 'mongoose';
const { Schema } = mongoose;

const imageSchema = new Schema({
    promptText: String,
    originalUrl: String,
    cloudinaryUrl: String,
    userId: String,
    asset_id: String,
    public_id: String,
    version_id: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    }
  });

  const ImageModel = mongoose.model('dall-e-p1', imageSchema);

  export default ImageModel;