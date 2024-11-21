const connectDB = require('../config/db');
const oracledb = require('oracledb')

const UserModel = {
    async getAllUsers() {
        const connection = await connectDB();
        const result = await connection.execute(`SELECT * FROM Users`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT, // Return rows as objects
        });
        await connection.close();
        return result.rows;
    },

    async getUserById(userId) {
        const connection = await connectDB();
        const result = await connection.execute(
            `SELECT * FROM Users WHERE UserID = :id`,
            [userId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        await connection.close();
        return result.rows[0];
    },

    async getUserByEmail(email) {
        const connection = await connectDB();
        const result = await connection.execute(
            `SELECT * FROM Users WHERE Email = :email`,
            [email],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        await connection.close();
        return result.rows[0];
    },

    async createUser(name, email, password, userType) {
        const connection = await connectDB();
        try {
            await connection.execute(
                `INSERT INTO Users (UserID, Name, Email, Password, user_type)
                 VALUES (user_id_seq.NEXTVAL, :name, :email, :password, :userType)`,
                [name, email, password, userType],
                { autoCommit: true }
            );
        } catch (err) {
            if (err.errorNum === 1) { // Unique constraint error
                throw new Error('Email already exists');
            } else {
                throw err;
            }
        } finally {
            await connection.close();
        }
    },

    async deleteUser(userId) {
        const connection = await connectDB();
        await connection.execute(
            `DELETE FROM Users WHERE UserID = :id`,
            [userId],
            { autoCommit: true }
        );
        await connection.close();
    },

    async getAllLawyers() {
        const connection = await connectDB();
        const result = await connection.execute(
            `SELECT UserID, Name FROM Users WHERE USER_TYPE = 'Lawyer'`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        await connection.close();
        return result.rows; // Return only the lawyers
    },
};

module.exports = UserModel;
