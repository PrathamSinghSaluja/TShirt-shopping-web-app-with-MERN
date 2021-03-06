const {Order,Productcart} = require("../models/order");

exports.getOrderById = (req,res,next,id) =>{
    Order.findById(id).populate("products.product","name price").exec((err,order)=>{
        if(err){
            return res.status(400).json({
                Error : "No Order found in DB"
            })
        }
        req.order = order;
        next()
    })
}

//create
exports.createOrder = (req,res) =>{
    req.body.order.user = req.profile;
    const order = new Order(req.body.order)
    order.save((err,order)=>{
        if(err){
            Error : "Failed to save your order in DB"
        }
        res.json(order)
    })
}


//read
exports.getAllOrders = (req,res)=>{
    Order.find().populate("user","_id name ").exec((err,order)=>{
        if(err){
            return res.status(400).json({
                Error : "No Orders Found in DB"
            })
        }
        res.json(order);
    })
}
exports.getOrderStatus = (req,res) =>{
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus = (req,res) =>{
    Order.update(
        {_id : req.body.orderId},
        {$set : {status : req.body.status}},
        (err,order) =>{
            if(err){
                return res.status(400).json({
                    Error : "Cannot update the order status",
                })
            }
            res.json(order)
        }
    )
}