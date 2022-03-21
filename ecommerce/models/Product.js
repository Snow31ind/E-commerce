import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    images: [{ type: String }],
    brand: { type: String, required: true },
    oldPrice: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    countInStock: { type: Number, default: 0 },
    general: mongoose.Schema.Types.Mixed,
    additionalFeatures: mongoose.Schema.Types.Mixed,
    connectivityFeatures: mongoose.Schema.Types.Mixed,
    dimensions: mongoose.Schema.Types.Mixed,
    displayAndAudioFeatures: mongoose.Schema.Types.Mixed,
    operatingSystem: mongoose.Schema.Types.Mixed,
    portAndSlotFeatures: mongoose.Schema.Types.Mixed,
    processorAndMemoryFeatures: mongoose.Schema.Types.Mixed,
    warranty: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
