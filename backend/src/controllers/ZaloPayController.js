const crypto = require('crypto');
const axios = require('axios');
const moment = require('moment');

const config = {
  app_id: process.env.ZALOPAY_APP_ID || "2553",
  key1: process.env.ZALOPAY_KEY1 || "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: process.env.ZALOPAY_KEY2 || "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: process.env.ZALOPAY_ENDPOINT || "https://sb-openapi.zalopay.vn/v2/create"
};

exports.createOrder = async (req, res) => {
  try {
    const { amount, description, return_url, order_id } = req.body;
    
    const embed_data = {
      redirecturl: return_url || "http://localhost:4200/orders"
    };

    const items = [{
      itemid: "food_order",
      itemname: description || "Đơn hàng thức ăn",
      itemprice: amount,
      itemquantity: 1
    }];

    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;

    const order = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount,
      description: description || `Thanh toán đơn hàng #${order_id}`,
      bank_code: "",
      callback_url: process.env.ZALOPAY_CALLBACK_URL || ""
    };

    // Tạo chuỗi ký MAC
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    console.log('ZaloPay Order Data:', order);

    // Gọi API ZaloPay
    const response = await axios.post(config.endpoint, null, { params: order });
    
    console.log('ZaloPay Response:', response.data);

    res.json({
      return_code: response.data.return_code,
      return_message: response.data.return_message,
      order_url: response.data.order_url,
      zp_trans_token: response.data.zp_trans_token,
      app_trans_id: app_trans_id,
      amount: amount
    });

  } catch (error) {
    console.error('ZaloPay Error:', error.response?.data || error.message);
    res.status(500).json({
      return_code: -1,
      return_message: "Lỗi tạo đơn hàng ZaloPay",
      error: error.response?.data || error.message
    });
  }
};

// Callback xử lý kết quả thanh toán từ ZaloPay
exports.callback = (req, res) => {
  let result = {};
  
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = crypto.createHmac('sha256', config.key2).update(dataStr).digest('hex');

    console.log('Callback MAC:', mac);
    console.log('Request MAC:', reqMac);

    // Kiểm tra callback hợp lệ
    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // Thanh toán thành công
      let dataJson = JSON.parse(dataStr);
      console.log("Payment success:", dataJson);
      
      // TODO: Cập nhật trạng thái đơn hàng trong database
      
      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    console.log("Callback error:", ex);
    result.return_code = 0;
    result.return_message = ex.message;
  }

  res.json(result);
};

// API kiểm tra trạng thái thanh toán
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { app_trans_id } = req.body;
    
    const data = config.app_id + "|" + app_trans_id + "|" + config.key1;
    const mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    const postData = {
      app_id: config.app_id,
      app_trans_id: app_trans_id,
      mac: mac
    };

    const response = await axios.post('https://sb-openapi.zalopay.vn/v2/query', null, { 
      params: postData 
    });

    res.json(response.data);
  } catch (error) {
    console.error('Check status error:', error);
    res.status(500).json({
      return_code: -1,
      return_message: "Lỗi kiểm tra trạng thái thanh toán"
    });
  }
};