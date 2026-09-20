//função cadastro de membros
import type { Request, Response } from "express";
import {prisma} from "../db.js";

//função cadastro
export const memberPost = async (req: Request, res: Response) => {
  try {
    const {
      nome, sobrenome, dataNascimento, sexo, estadoCivil, conjugue, profissao, 
      cpf, rg, telefone, celular, email, rua, numero, bairro, cidade, cep, 
      estado, cargoEcles, igrejaBat, dataBat, obs
    } = req.body;

    // 1. Validação dos campos obrigatórios do controller
    if (!nome || !sobrenome || !dataNascimento || !sexo || !estadoCivil || !cpf || !cargoEcles) {
      res.status(400).json({ message: "Todas as informações obrigatórias são exigidas!" });
      return;
    }

    // 1. Define a função utilitária de limpeza
const cleanMask = (value?: string) => value ? value.replace(/\D/g, '') : null;

// 2. Limpa o CPF que veio da requisição
const cpfLimpo = cleanMask(cpf);

// 3. Busca no banco usando o CPF LIMPO (como ele é salvo)
const memb = await prisma.membros.findFirst({
  where: { cpf: cpfLimpo }
});

if (memb) {
  res.status(409).json({ message: "Membro já está cadastrado no sistema" });
  return;
}
    // 2. Criação do membro no banco via Prisma
    const newMember = await prisma.membros.create({
      data: {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        datanasc: new Date(dataNascimento), // Converte string 'YYYY-MM-DD' em Date
        sexo: sexo,
        estadocivil: estadoCivil,
        conjugue: conjugue?.trim() || null,
        profissao: profissao?.trim() || null,
        
        // Dados formatados sem máscara para o banco
        cpf: cleanMask(cpf)!,
        rg: cleanMask(rg),
        telefone: cleanMask(telefone),
        celular: cleanMask(celular),
        cep: cleanMask(cep),

        email: email?.trim() || null,
        rua: rua?.trim() || null,
        numero: numero?.trim() || null,
        bairro: bairro?.trim() || null,
        cidade: cidade?.trim() || null,
        estado: estado || null,
        cargoecles: cargoEcles,
        igrejabat: igrejaBat?.trim() || null,
        
        // Tratamento correto de data opcional
        databat: dataBat ? new Date(dataBat) : null,
        obs: obs?.trim() || null,
      }
    });

    res.status(201).json({ message: "Membro cadastrado com sucesso!", id: newMember.id });
    return;

  } catch (error: any) {
    console.error("Erro ao cadastrar: ", error);

    // Trata erro de duplicidade de chave única do Prisma (Ex: CPF único)
    if (error.code === 'P2002') {
      res.status(409).json({ message: "Já existe um membro cadastrado com este CPF." });
      return;
    }

    res.status(500).json({ message: "Erro no servidor, tente novamente mais tarde!" });
    return;
  }
};

//função busca por cadastro 
export const memberGet = async (req: Request, res: Response) => {
  try{
  const members = await prisma.membros.findMany();

  if(members.length === 0){
    res.status(404).json({message: "Não há membro cadastrado no momento!"});
    return;
  }

  res.json(members);
  }catch(error: any){
    console.error("Erro ao encontrar membros cadastrados: ", error);
    res.status(500).json({message: "Erro no servidor, tente novamente mais tarde! "});
    return;
  }
}

//função remover membro
export const memberDelete = async (req: Request, res: Response) => {
  try{
    const {id} = req.params;

    if(!id){
      res.status(400).json({message: "ID do usuario não fornecido"});
      return;
    }

    //Convertemos para number 
    const numberId = Number(id);

    //verifica se o membro existe
    const verMem = await prisma.membros.findUnique({
      where: {id: numberId
      }
    });

    if(!verMem){
      res.status(400).json({message: "Membro não encontrado!"});
      return;
    }

    //execulta a deleção
    await prisma.membros.delete({
      where: {id: numberId}
    });

    //retorna resposta de sucesso
    res.status(200).json({message: "Membro deletado com sucesso!"});


  }catch(error){
    console.error("Erro ao deletar membro: ", error);
    res.status(500).json({message: "Erro no servidor, tente novamente mais tarde!"});
    return;

  }


}

//função update membro
export const memberUpdate = async (req: Request, res: Response) => {
  try {
    // 1. Recebe o id via parâmetros da requisição (ex: /membros/update/:id)
    const { id } = req.params;

    const {
      nome, sobrenome, dataNascimento, sexo, estadoCivil, conjugue, profissao, 
      cpf, rg, telefone, celular, email, rua, numero, bairro, cidade, cep, 
      estado, cargoEcles, igrejaBat, dataBat, obs
    } = req.body;

    // 2. Validação básica do ID
    if (!id) {
      res.status(400).json({ message: "O ID do membro é obrigatório!" });
      return;
    }

    // 3. Validação dos campos obrigatórios do controller
    if (!nome || !sobrenome || !dataNascimento || !sexo || !estadoCivil || !cpf || !cargoEcles) {
      res.status(400).json({ message: "Todas as informações obrigatórias são exigidas!" });
      return;
    }

    // 4. Função utilitária de limpeza
    const cleanMask = (value?: string) => value ? value.replace(/\D/g, '') : null;

    const memberId = Number(id); // Converte para número caso o ID do banco seja numérico
    const cpfLimpo = cleanMask(cpf);

    // 5. Verifica se o membro a ser editado realmente existe no banco
    const existingMember = await prisma.membros.findUnique({
      where: { id: memberId }
    });

    if (!existingMember) {
      res.status(404).json({ message: "Membro não encontrado!" });
      return;
    }

    // 6. Verifica se o CPF informado pertence a OUTRO membro já cadastrado
    if (cpfLimpo) {
      const duplicateCpf = await prisma.membros.findFirst({
        where: {
          cpf: cpfLimpo,
          NOT: { id: memberId } // Ignora o próprio registro que está sendo atualizado
        }
      });

      if (duplicateCpf) {
        res.status(409).json({ message: "Este CPF já está em uso por outro membro!" });
        return;
      }
    }

    // 7. Atualização do membro no banco via Prisma
    const updatedMember = await prisma.membros.update({
      where: { id: memberId },
      data: {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        datanasc: new Date(dataNascimento), // Converte string 'YYYY-MM-DD' em Date
        sexo: sexo,
        estadocivil: estadoCivil,
        conjugue: conjugue?.trim() || null,
        profissao: profissao?.trim() || null,

        // Dados formatados sem máscara
        cpf: cpfLimpo!,
        rg: cleanMask(rg),
        telefone: cleanMask(telefone),
        celular: cleanMask(celular),
        cep: cleanMask(cep),

        email: email?.trim() || null,
        rua: rua?.trim() || null,
        numero: numero?.trim() || null,
        bairro: bairro?.trim() || null,
        cidade: cidade?.trim() || null,
        estado: estado || null,
        cargoecles: cargoEcles,
        igrejabat: igrejaBat?.trim() || null,

        // Tratamento de data opcional
        databat: dataBat ? new Date(dataBat) : null,
        obs: obs?.trim() || null,
      }
    });

    res.status(200).json({ message: "Membro atualizado com sucesso!", id: updatedMember.id });
    return;

  } catch (error: any) {
    console.error("Erro ao atualizar membro: ", error);

    // Trata erro de duplicidade de chave única do Prisma
    if (error.code === 'P2002') {
      res.status(409).json({ message: "Já existe outro membro cadastrado com este CPF." });
      return;
    }

    // Caso o ID não exista ao tentar dar o update no Prisma
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Membro não encontrado no banco de dados." });
      return;
    }

    res.status(500).json({ message: "Erro no servidor, tente novamente mais tarde!" });
    return;
  }
};