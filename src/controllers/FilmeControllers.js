const Filme = require("../models/Filmes");
let message = "";
let type = "";
const orderById = { order: [["id", "ASC"]] };
const Op = require("sequelize").Op; 
const getAll = async (req, res) => {
  
  try {
   
    const filmes = await Filme.findAll(orderById); 
    res.render("index", {
      filmes,
      //filmesPut: null,
      //filmesDel: null,
      message,
      type,
      filmeSearch: [],
    });
  } catch (err) {

    res.status(500).send({ err: err.message });
  }
};


const getById = async (req, res) => {
  try {
    const filme = await Filme.findByPk(req.params.id); 
    const filmes = await Filme.findAll(orderById);
    res.render("detalhes", {
      filme,
      message,
      type,
      filmeSearch: [],
    });
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
};

//rota de criação do filme
const criar = (req, res) => {
  try {
    res.render("criar", { message, type });
  } catch (err) {

    res.status(500).send({ err: err.message }); 
  }
};

const criacao = async (req, res) => {
  try {
    const filme = req.body; //a requisição que vem do body, pegando os dados que vem do body
    if (
         !filme.nome || 
         !filme.descricao || 
         !filme.imagem) 
         {
      message = "Por Favor. Preencher todos os campos para cadastro!";
      type = "danger";
      return res.redirect("/criar");
    }
    await Filme.create(filme); //model filme e cria o filme que chegou, async espera essa transação
    res.redirect("/");
  } catch (err) {

    res.status(500).send({ err: err.message }); //vem do objeto erro
  }
};

//rota editar filme
const editar1 = async (req, res) => {
  const filme = await Filme.findByPk(req.params.id);

  if (!filme) {
    res.render("editar", {
      message: "Filme não foi encontrado!",
      type: "danger",
    });
  }
  res.render("editar", {
    filme,
    message: "Editado com sucesso",
    type:"success",
  });
};

//rota de edição do filme
const editar = async (req, res) => {
  try {
    const filme = await Filme.findByPk(req.params.id);
    const { nome, descricao, imagem } = req.body;

    filme.nome = nome;
    filme.descricao = descricao;
    filme.imagem = imagem;

    const filmeEditado = await filme.save();
     res.render("editar", {
         filme: filmeEditado,
         message:"Filme editado com sucesso!",
     });
    res.redirect("/");
  } catch (err) {

    res.status(500).send({ err: err.message }); //vem do objeto erro
  }
};

// rota deletar o filme
// const deletar = async (req, res) => {
//   try {
//     await Filme.destroy({ where: { id: req.params.id } });
//     message = "Filme removido com sucesso",
//     type = "success",
//     res.redirect("/");
//   } catch (err) {
//     //deu erro, venha nesse caminho
//     res.status(500).send({ err: err.message }); //vem do objeto erro
//   }
// };

//rota da prof duda deletar
const deletar = async (req,res) => {
  try{
    const filme = await Filme.findByPk(req.params.id);

    if(!filme){
      res.render("deletar", {
        message: "Filme não foi encontrado!",
        type: "danger",
      });
    }
    res.render("deletar", {
      filme, message:"",
    });
  }catch (err) {
    //deu erro, venha nesse caminho
    res.status(500).send({ err: err.message }); //vem do objeto erro
}
};

const deletar1 = async (req,res) => {
  const filme = await Filme.findByPk(req.params.id);

  if(!filme){
    res.render("deletar", {
      message: "Filme não encontrado",
    });
  }

  await filme.destroy();
  res.redirect("/");
};

const pesquisaNome = async (req, res) => {
  try {
    const filme = await Filme.findAll({
      where: {
        
        nome: {
         
          [Op.like]: `%${req.body.filme}%`, 
        }, 
      },
      order: [["id", "ASC"]],
    });

    if (filme.length == 0) {
      message = "Filme não foi encontrado",
      type = "danger"
      return res.redirect("/");
    }

    res.render("index", {
      filmes: [],
      message,
      type,
      filmeSearch: filme,
    });
  } catch (err) {
  
    res.status(500).send({ err: err.message }); 
  }
};

module.exports = {
  getAll,
  getById,
  criar,
  criacao,
  editar1,
  editar,
  deletar,
  deletar1,
  pesquisaNome,
};