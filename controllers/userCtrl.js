const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// Register Controller
const registerController = async (req, res) => {
    try {
        const { email, password, name, userType } = req.body;

        // Check if user already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res
                .status(200)
                .send({ message: 'User already exists', success: false });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Set default userType if not provided
        const defaultUserType = 'LawStudent'; // Default value for userType
        const validUserTypes = ['Lawyer', 'LawStudent', 'Admin'];
        const finalUserType = userType && validUserTypes.includes(userType) ? userType : defaultUserType;

        // Create a new user
        await userModel.createUser(name, email, hashedPassword, finalUserType);

        res.status(201).send({ message: 'Registered successfully', success: true });
    } catch (error) {
        console.error('Error in registerController:', error.message);
        res.status(500).send({
            success: false,
            message: `Register Controller: ${error.message}`,
        });
    }
};

// Login Controller for OracleDB
const loginController = async (req, res) => {
    try {
        // Fetch user from the database by email
        const user = await userModel.getUserByEmail(req.body.email);

        if (!user) {
            return res.status(200).send({ message: 'User not found', success: false });
        }

        // Compare the provided password with the hashed password from the database
        const isMatch = await bcrypt.compare(req.body.password, user.PASSWORD);
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid Email or Password', success: false });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.USERID, userType: user.USER_TYPE }, // Include user ID and type in the token
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Set token expiration to 1 day
        );

        // Respond with success message and token
        res.status(200).send({ message: 'Login Successful', success: true, token });
    } catch (error) {
        console.error('Error in loginController:', error.message);
        res.status(500).send({ message: 'Error in Login Controller: ${ error.message }', success: false });
    }
};

const authController = async (req, res) => {
    try {
        // Fetch user from the database by userId
        const user = await userModel.getUserById(req.body.userId);
        user.password = undefined;
        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false,
            });
        }

        // Respond with user data
        res.status(200).send({
            success: true,
            data: {
              email: user.EMAIL, // Add the user's unique ID
              name: user.NAME, // Ensure this matches your OracleDB column names
              userType: user.USER_TYPE, // Send user type (Lawyer or LawStudent)
            },
          });
          
          
    } catch (error) {
        console.error("Error in authController:", error.message);
        res.status(500).send({ message: 'Error in Login Controller: ${ error.message }', success: false });
    }
};
const LawyersController = async (req, res) => {
    try {
        const lawyers = await userModel.getAllLawyers(); // Fetch lawyers from the model
        res.status(200).send({
            success: true,
            message: "Lawyers fetched successfully",
            data: lawyers,
        });
    } catch (error) {
        console.error("Error in getAllLawyersController:", error.message);
        res.status(500).send({
            success: false,
            message: `Error fetching lawyers: ${error.message}`,
        });
    }
};



module.exports = { loginController, registerController, authController, LawyersController };
