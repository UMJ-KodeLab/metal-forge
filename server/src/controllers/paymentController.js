const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { Order, OrderItem, Product } = require('../models');
const config = require('../config');

const client = new MercadoPagoConfig({
  accessToken: config.mercadopago.accessToken,
});

const createPreference = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findByPk(orderId, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          attributes: ['id', 'title', 'artist', 'price'],
        }],
      }],
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.userId !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const items = order.items.map((item) => ({
      title: `${item.Product.title} - ${item.Product.artist}`,
      quantity: item.quantity,
      unit_price: parseFloat(item.unitPrice),
      currency_id: 'ARS',
    }));

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${config.clientUrl}/payment/success`,
          failure: `${config.clientUrl}/payment/failure`,
          pending: `${config.clientUrl}/payment/pending`,
        },
        auto_return: 'approved',
        external_reference: String(order.id),
      },
    });

    res.status(200).json({
      preferenceId: result.id,
      initPoint: result.init_point,
    });
  } catch (error) {
    console.error('CreatePreference error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const webhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: data.id });

      if (paymentData.status === 'approved') {
        const orderId = paymentData.external_reference;

        await Order.update(
          { status: 'paid', paymentId: String(data.id) },
          { where: { id: orderId } }
        );
      }
    }

    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createPreference, webhook };
