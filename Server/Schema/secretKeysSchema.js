import mongoose from 'mongoose';
const { Schema } = mongoose;

const secretKeySchema = new Schema({
    secretKey: String,
    allowedCounts: Number,
    remainingCounts: Number,
  });

  const SecretKeyModel = mongoose.model('dall-e-p1-secrets', secretKeySchema);

  export default SecretKeyModel;