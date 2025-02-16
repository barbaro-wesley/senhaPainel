const fs = require("fs");
const path = require("path");

exports.imprimirSenha = (req, res) => {
  const { numero, setor, tipo } = req.body;

  // Simulação de impressão: exibe no console
  console.log("=== Dados da Senha para Impressão ===");
  console.log(`Senha: ${numero}`);
  console.log(`Setor: ${setor}`);
  console.log(`Tipo: ${tipo}`);
  console.log("=====================================");

  // Simulação de impressão: salva em um arquivo de texto
  const dadosImpressao = `Senha: ${numero}\nSetor: ${setor}\nTipo: ${tipo}\n\n`;
  const caminhoArquivo = path.join(__dirname, "..", "senhas_impressas.txt");

  fs.appendFile(caminhoArquivo, dadosImpressao, (error) => {
    if (error) {
      console.error("Erro ao salvar arquivo de simulação:", error);
      return res.status(500).json({ message: "Erro ao simular impressão" });
    }

    console.log("Dados da senha salvos em senhas_impressas.txt");
    res.json({ message: "Simulação de impressão realizada com sucesso" });
  });
};