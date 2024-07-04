import { userModel } from "../models/user.js";
import { sendEmailChangePassword } from "../utils/nodemailer.js";
import jwt from 'jsonwebtoken'
import { validatePassword, createHash } from "../utils/bcrypt.js";
export const login = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send("Usuario o contraseña no validos")
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }

        res.status(200).send("Usuario logueado correctamente")

    } catch (e) {
        res.status(500).send("Error al loguear usuario")
    }
}

export const register = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send("Usuario ya existente en la aplicacion")
        }

        res.status(200).send("Usuario creado correctamente")

    } catch (e) {
        res.status(500).send("Error al registrar usuario")
    }

}

export const logout = async (req, res) => {
    const user = await userModel.findOne({ email: req.session.user.email })
    user.last_connection = new Date()
    await user.save()
    req.session.destroy(function (e) {
        if (e) {
            console.log(e)
        } else {
            res.status(200).redirect("/")
        }

    })

}

export const sessionGithub = async (req, res) => {
    console.log(req)
    req.session.user = {
        email: req.user.email,
        first_name: req.user.name
    }
    res.redirect('/')

}

export const testJWT = async (req, res) => {
    console.log("Desde testJWT" + req.user)
    if (req.user.rol == 'User')
        res.status(403).send("Usuario no autorizado")
    else
        res.status(200).send(req.user)
}

export const changePassword = async (req, res) => {
    const { token } = req.params
    const { newPassword } = req.body
    try {
        const validateToken = jwt.verify(token.substr(6,), "coder")
        const user = await userModel.findOne({ email: validateToken.userEmail })
        if (user) {
            if (!validatePassword(newPassword, user.password)) {
                const hashPassword = createHash(newPassword)
                user.password = hashPassword
                const resultado = await userModel.findByIdAndUpdate(user._id, user)
                console.log(resultado)
                res.status(200).send("Contraseña modificada correctamente")
            } else {
                res.status(400).send("La contraseña no puede ser identica a a la anterior")
                //Contraseñas iguales
            }
        } else {
            res.status(404).send("Usuario no encontrado")
        }

    } catch (e) {
        console.log(e)
        if (e?.message == 'jwt expired') {
            res.status(400).send("Paso el tiempo maximo para recuperar la contraseña. Se enviara otro mail correspondiente para cambiarla")
        }
        res.status(500).send(e)
    }

}

export const sendEmailPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.find({ email: email })

        if (user) {
            const token = jwt.sign({ userEmail: email }, "coder", { expiresIn: '1m' })
            const resetLink = `http://localhost:8000/api/session/reset-password?token=${token}`
            sendEmailChangePassword(email, resetLink)
            res.status(200).send("Email enviado correctamente")
        } else {
            res.status(404).send("Usuario no encontrado")
        }
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }


}