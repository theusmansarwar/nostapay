const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsersSchema = new Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  code:{type: String, required: true},
  loginOtp: { type: String,default: "" },
  paymentOtp: { type: String,default: "" },
  refCode: { type: String,default: "" },
  totalRef: { type: String, default: 0},
  referralList: [{ type: Schema.Types.ObjectId, ref: 'Users' }], 

  transaction: [{ type: Schema.Types.ObjectId, ref: 'Transactions' }],

  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },

  profileImg: { type: String ,default: ""},
  dateOfBirth: { type: Date, required: true },

  wallet: {
    availableBalance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    totalWithdraw: { type: Number, default: 0 },
    totalDeposit: { type: Number, default: 0 },
    referalBalance: { type: Number, default: 0 },
  },

  isCompany: { type: Boolean, default: false },
  companyDetail: { type: Schema.Types.ObjectId, ref: 'Company' }

}, { timestamps: true });

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users; 
