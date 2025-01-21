// const bcrypt = require("bcryptjs");
// const oracledb = require("oracledb");
// const connectDB = require('../config/db');  // Assuming your db connection is configured here

// async function insertAdmin() {
//     const adminEmail = "zain@admin.com";
//     const existingAdmin = await checkIfAdminExists(adminEmail);  // Check if admin exists
    
//     if (existingAdmin) {
//         console.log("Admin already exists in the database.");
//         return;
//     }

//     const adminPassword = "admin123"; // Plain-text password
//     const hashedPassword = await bcrypt.hash(adminPassword, 10); // Hash the password

//     // Insert the admin user
//     const connection = await connectDB();
//     await connection.execute(
//         `INSERT INTO Users (UserID, Name, Email, Password, User_Type)
//          VALUES (user_id_seq.NEXTVAL, :name, :email, :password, :userType)`,
//         {
//             name: "zain",
//             email: "zain@admin.com",
//             password: hashedPassword, // Store the hashed password
//             userType: "Admin"
//         },
//         { autoCommit: true }
//     );
//     await connection.close();
//     console.log("Admin user inserted successfully.");
// }

// async function checkIfAdminExists(email) {
//     const connection = await connectDB();
//     const result = await connection.execute(
//         `SELECT * FROM Users WHERE Email = :email`,
//         [email],
//         { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );
//     await connection.close();
//     return result.rows.length > 0;  // If the admin already exists, return true
// }

// insertAdmin().catch((error) => {
//     console.error("Error inserting admin:", error);
// });