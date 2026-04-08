const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const { Resend } = require('resend');

const app = express();
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// config email

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend OK!');
});

//LOGIN
const bcrypt = require('bcrypt')

app.post('/api/login', async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ erro: 'Usuário e senha obrigatórias.'});
    }

    try {
        const usuario = await prisma.user.findFirst({
            where: { user } 
        });

        if (!usuario) {
            return res.status(401).json({erro: 'Usuário não encontrado.'});
        }

        const senhaCorreta = await bcrypt.compare(password, usuario.password);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Senha incorreta.' });
        }

        return res.status(200).json({
            id: usuario.id,
            user: usuario.user
        });
    } catch (error) {
        console.log('Erro no login:', error);
        return res.status(500).json({ erro: 'Erro ao realizar login.' });
    }
})

// CONTATOS NOVOS
app.post('/api/contato', async(req, res) => {
    const { nome, telefone, email, mensagem } = req.body;

    if(!nome || !telefone || !email || !mensagem){
       return res.status(400).json({ 
        error: "Todos os campos (nome, email, mensagem) são obrigatórios." 
    }); 
    }

    try{
        const novoLead = await prisma.lead.create({
            data: {
                nome,
                telefone, 
                email,
                mensagem
            }
        });

        const data = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'tecnologia@asfaltopav.com.br',
                replyTo: email,
                subject: `Novo contato de ${nome}, via portfólio.`,
                html: `<p>Novo contato de <strong>${nome}<strong>!</p>
                <p>${mensagem}</p>
                <p>Dados para contato.</p>
                <p>Telefone: ${telefone}</p>
                <p>Email: ${email}</p>`
        })

        res.status(201).json(novoLead);
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "erro ao processar"});
    }
});

// ABASTECIMENTOS
// regrista novo abastecimento
app.post('/api/abastecimento', async (req, res) => {
    const { placa, marca, modelo, km, horimetro, operador, litros, preco, total, posto, foto} = req.body;

     if (!placa || !operador || !litros || !preco || !posto) {
    return res.status(400).json({
      error: 'Campos obrigatórios: placa, operador, litros, preco, posto.'
    });
  }

  try {
    const novoAbastecimento = await prisma.abastecimento.create({
        data: {
            placa, 
            marca: marca || null,
            modelo: modelo || null,
            km: km || '0', 
            horimetro: horimetro || '0',
            operador,
            litros: parseFloat(litros),
            preco: parseFloat(preco),
            total: parseFloat(total),
            posto,
            foto: foto || null,
        }
    });
    res.status(201).json(novoAbastecimento);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Erro ao regristrar abastecimento.'});
  }
});

//lista abastecimentos
app.get('/api/abastecimento', async (req, res) => {
    try {
        const abastecimentos = await prisma.abastecimento.findMany({
            orderBy: { createdAt: 'desc'}
        });
        res.json(abastecimentos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar abastecimentos.'});
    }
});

//relatorio abastecimento
app.get('/api/relatorio/abastecimento', async (req, res) => {
    try {
        const veiculos = await prisma.veiculo.findMany({
            orderBy: { placa: 'asc'}
        });

        const result = await Promise.all(veiculos.map(async (veiculo) => {
            const ultimoAbast = await prisma.abastecimento.findFirst({
                where: { placa: veiculo.placa},
                orderBy: { createdAt: 'desc'},
            });

            return {
                placa: veiculo.placa,
                marca: veiculo.marca,
                modelo: veiculo.modelo,
                ultimoAbast: ultimoAbast || null
            };
        }));

        return res.status(200).json(result);
    }catch (error){
        console.log('Erro ao buscar relatório.', error);
        return res.status(500).json({ erro: 'Erro ao buscar relatório.'})
    }
});

//USUARIOS
//registra novo usuário 
app.post('/api/usuario', async (req, res) => {
 
    const { user, password } = req.body;
 
    try {

        const senhaCriptografa = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data : {
                user,
                password: senhaCriptografa
            },
        });

        return res.status(201).json({ 
            id: newUser.id, 
            user: newUser.user 
        });
    } catch (error) {
        console.log("Erro ao cadastrar usuário.", error);
        return res.status(500).json({
            erro: 'Não foi possível cadastrar usuário.'
        })
    }
});

//lista usuário
app.get('/api/usuario', async (req, res) => {
    try {
        const usuarios = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.status(200).json(usuarios);
    } catch (error) {
        console.log("Erro ao buscar usuários:", error);
        return res.status(500).json({
            erro: 'Não foi possivel listar usuários.'
        })
    }
})

//VEICULOS
//registra novo veículo
app.post('/api/veiculos', async (req, res) => {
    try{
        const {
            placa, marca, modelo, anoFabricacao, anoModelo, 
            chassi, renavam, cor, combustivel, kmAtual,
            status, observacoes, codigoFrota
        } = req.body;

        const novoVeiculo = await prisma.veiculo.create({
            data : {
                placa,
                codigoFrota,
                marca, 
                modelo,
                anoFabricacao,
                anoModelo,
                chassi,
                renavam,
                cor,
                combustivel,
                kmAtual,
                status, 
                observacoes
            },
        });

        return res.status(201).json(novoVeiculo);
    } catch (error) {
        console.log("Erro ao cadastrar veículo.", error);
        return res.status(500).json({
            erro: 'Não foi possível cadastrar veículo. Verifique e tente novamente.'
        })
    }
});

//busca veiculo por placa
app.get('/api/veiculos/:placa', async ( req, res ) => {
    try {
        const { placa } = req.params;

        const veiculo = await prisma.veiculo.findFirst({
            where: {
                placa: {
                    equals: placa.toUpperCase(),
                }
            }
        });

        if (!veiculo) {
            return res.status(404).json({erro: 'Veículo não cadastrado.'});
        }

        return res.status(200).json(veiculo);
    } catch (error) {
        console.log('Erro ao buscar veículo.', error);
        return res.status(500).json({ erro: 'Erro ao buscar veículo.'});
    }
})

//lista todos os veículo
app.get('/api/veiculos', async (req, res) => {
    try {
        const veiculos = await prisma.veiculo.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(veiculos);
    } catch (error) {
        console.log("Erro ao buscar veículos:", error);
        return res.status(500).json({
            erro: 'Não foi possível listar os veículos.'
        })
    }
})

if (process.env.NODE_ENV !== 'production'){
    app.listen(3000, () => console.log('Servidor rodando  na porta 3000'));
}

module.exports = app;
