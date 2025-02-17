
const escpos = require("escpos");
escpos.Network = require("escpos-network");

exports.imprimirSenha = async (req, res) => {
  const { numero, setor, tipo } = req.body;

  try {
    // Configuração da impressora (substitua pelo IP e porta da sua impressora)
    const device = new escpos.Network("192.168.0.244", 9100); // IP e porta da impressora
    const printer = new escpos.Printer(device);

    device.open((error) => {
      if (error) {
        console.error("Erro ao conectar à impressora:", error);
        return res.status(500).json({ message: "Erro ao conectar à impressora" });
      }

      // Comandos de impressão
      printer
        .font("a")
        .align("ct")
        .size(2, 2)
        .text("Senha: " + numero)
        .size(1, 1)
        .text("Setor: " + setor)
        .text("Tipo: " + tipo)
        .cut()
        .close(() => {
          res.json({ message: "Senha impressa com sucesso" });
        });
    });
  } catch (error) {
    console.error("Erro ao imprimir senha:", error);
    res.status(500).json({ message: "Erro ao imprimir senha" });
  }
};
