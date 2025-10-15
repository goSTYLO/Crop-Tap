const db = require('../models');
const Product = db.Product;
const User = db.User;
const imageService = require('../services/imageService');

exports.createProduct = async (req, res) => {
  try {
    let imageFilename = null;
    let farmerName = 'farmer';

    if (req.body.farmer_id) {
      const farmer = await User.findByPk(req.body.farmer_id);
      if (farmer) farmerName = farmer.name;
    }

    if (req.file) {
      imageFilename = await imageService.saveCompressedImage(req.file, farmerName);
    }

    const productData = {
      ...req.body,
      image_url: imageFilename
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const imageUrl = product.image_url
      ? `${req.protocol}://${req.get('host')}/productImgs/${product.image_url}`
      : null;

    res.json({ ...product.toJSON(), image_url: imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    const enriched = products.map(p => {
      const imageUrl = p.image_url
        ? `${req.protocol}://${req.get('host')}/productImgs/${p.image_url}`
        : null;
      return { ...p.toJSON(), image_url: imageUrl };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let imageFilename = null;
    let farmerName = 'farmer';

    if (req.body.farmer_id) {
      const farmer = await User.findByPk(req.body.farmer_id);
      if (farmer) farmerName = farmer.name;
    }

    if (req.file) {
      imageFilename = await imageService.saveCompressedImage(req.file, farmerName);
    }

    const updateData = {
      ...req.body,
      ...(imageFilename && { image_url: imageFilename })
    };

    const [updated] = await Product.update(updateData, {
      where: { product_id: req.params.id }
    });

    if (!updated) return res.status(404).json({ error: 'Product not found' });

    const product = await Product.findByPk(req.params.id);
    const imageUrl = product.image_url
      ? `${req.protocol}://${req.get('host')}/productImgs/${product.image_url}`
      : null;

    res.json({ ...product.toJSON(), image_url: imageUrl });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { product_id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};