import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport(
    {
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {

            user: 'c4chamok@gmail.com',
            pass: process.env.Google_App_Password
        }
    })

export default transporter;