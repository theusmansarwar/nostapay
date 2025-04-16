const Users = require("../Models/usersModel");
const Transactions = require("../Models/transactionsModel");
const crypto = require("crypto");

// Function to generate a random alphanumeric code
const generateUniqueCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g., "A1B2C3"
    const existingUser = await Users.findOne({ code });
    if (!existingUser) exists = false;
  }

  return code;
};
const generateTrxId = () => {
    return "TRX-" + crypto.randomBytes(4).toString("hex").toUpperCase() + "-" + Date.now();
  };
  

const registerUser = async (req, res) => {
  const { name, fatherName, email, phone, password, dateOfBirth,refCode } = req.body;

  const missingFields = [];
  if (!name) missingFields.push({ name: "name", message: "Name is required" });
  if (!fatherName) missingFields.push({ name: "fatherName", message: "Father name is required" });
  if (!email) missingFields.push({ name: "email", message: "Email is required" });
  else if (!email.includes("@")) missingFields.push({ name: "email", message: "Invalid email" });
  if (!phone) missingFields.push({ name: "phone", message: "Phone is required" });
  if (!password) missingFields.push({ name: "password", message: "Password is required" });
  if (!dateOfBirth) missingFields.push({ name: "dateOfBirth", message: "Date of Birth is required" });

  if (missingFields.length > 0) {
    return res.status(400).json({
      status: 400,
      message: "Missing or invalid fields",
      missingFields,
    });
  }

  try {
    
    const userExists = await Users.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(409).json({ status: 409, message: "User already exists" });
    }

    

    if (refCode) {
        const uniqueCode = await generateUniqueCode();
   
        const refExists = await Users.findOne({ $or: [{ code:refCode }] });
        if(!refExists){
            return res.status(404).json({ status: 404, message: "Ref Code Not Exist" });
        }
    
       
        const newUser = await Users.create({
            name,
            fatherName,
            email,
            phone,
            password,
            dateOfBirth,
            code: uniqueCode,
            refCode
          });
          const trxId = generateTrxId();
        const transaction = await Transactions.create({
            trxId,
            type: "referral",
            from: newUser._id,
            to: refExists._id,
            gateway: "system",
            amount: "10",
            status:"pending",
            fees: "0"
          });
          refExists.referralList.push(newUser._id);
          refExists.transaction.push(transaction._id);
        refExists.wallet.referalBalance += 10;
        await refExists.save();
        return res.status(201).json({
            status: 201,
            message: "User registered successfully",
        
          });
 
      }
      else{
        const uniqueCode = await generateUniqueCode();
    
       
        const newUser = await Users.create({
            name,
            fatherName,
            email,
            phone,
            password,
            dateOfBirth,
            code: uniqueCode,
          });
          return res.status(201).json({
            status: 201,
            message: "User registered successfully",
        
          });
      }
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};
module.exports = {
  registerUser,
};
