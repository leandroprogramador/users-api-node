import express, { response } from 'express'
import { PrismaClient } from './generated/prisma/index.js'
import cors from 'cors'


const prisma = new PrismaClient()
const app = express()
app.use(express.json())
app.use(cors())





app.get('/users', async (req, res) => {
    try {
        let users = []
        if (req.query) {
            users = await prisma.user.findMany({
                 where: {
                    name : req.query.name,
                    email : req.query.email,
                ...(req.query.age && parseInt(req.query.age) !== 0
                    ? { age: parseInt(req.query.age) }
                    : {})
            }
            })
        } else {
            users = await prisma.user.findMany()
        }
        res.status(200).json(users)
    } catch (ex) {
        console.error('Erro ao listar usuário:', ex);
        res.status(500).json({ error: 'Erro ao listar usuário: \n' + ex })
    }
})

app.post('/users', async (req, res) => {
    try {
        await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                age: req.body.age
            }

        })

        res.status(200).json({ message: 'success', data: req.body })
    }
    catch (ex) {
        console.error('Erro ao criar usuário:', ex);
        res.status(500).json({ error: 'Erro ao criar usuário: \n' + ex })
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                age: req.body.age
            }

        })

        res.status(200).json({ message: 'success', data: req.body })
    }
    catch (ex) {
        console.error('Erro ao atualizar usuário:', ex);
        res.status(500).json({ error: 'Erro ao atualizar usuário: \n' + ex })
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        await prisma.user.delete({
            where: {
                id: req.params.id
            }

        })

        res.status(200).json({ message: 'success' })
    }
    catch (ex) {
        console.error('Erro ao deletar usuário:', ex);
        res.status(500).json({ error: 'Erro ao criar usuário: \n' + ex })
    }
})
app.listen(3000)