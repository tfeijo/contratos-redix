import { UploadStatus } from '@prisma/client';
import prisma from '../../src/database/prisma.js';
import { strip, isValid as isValidCNPJ } from '@fnando/cnpj';
import { parse } from 'csv-parse/sync';

async function processFile({ uploadId, buffer }) {
  const csvData = Buffer.from(buffer, 'base64').toString('utf-8');

  const linhasComErro = [];
  let linhasSucesso = 0;

  try {
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const requiredFields = ['CNPJ', 'NomeDaEmpresa', 'DadosAdicionais'];
    const firstRow = records[0];

    if (!firstRow || !requiredFields.every((f) => f in firstRow)) {
      const messageError = `Arquivo inválido. Campos obrigatórios: ${requiredFields.join(
        ', ',
      )}.`;
      
      console.error(
        `Erro no arquivo ${uploadId}: Campos obrigatórios ausentes ou vazios.`,
      );
      
      linhasComErro.push({
        linha: 1,
        erro: messageError
      });

      throw new Error(
        messageError,
      );
    }

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const linha = i + 2;
      const { CNPJ, NomeDaEmpresa, DadosAdicionais } = row;

      if (!CNPJ || !NomeDaEmpresa) {
        linhasComErro.push({
          linha,
          erro: `Campos obrigatórios ausentes ou vazios.`,
          dados: row,
        });
        continue;
      }

      const cnpjLimpo = strip(String(CNPJ));

      if (!isValidCNPJ(cnpjLimpo)) {
        linhasComErro.push({
          linha,
          erro: `CNPJ inválido: ${CNPJ}`,
          dados: row,
        });
        continue;
      }

      try {
        await prisma.contrato.create({
          data: {
            cnpj: cnpjLimpo,
            businessName: NomeDaEmpresa,
            additionalData: DadosAdicionais,
            arquivo: { connect: { id: uploadId } },
          },
        });
        linhasSucesso++;
      } catch (insertError) {
        const newObjetcError =
          insertError.code === 'P2002'
            ? {
                linha,
                erro: `CNPJ duplicado: ${cnpjLimpo}`,
                dados: row,
              }
            : {
                linha,
                erro: `Erro ao inserir no banco: ${insertError.message}`,
                dados: row,
              };
        console.error(
          `Erro ao inserir na linha ${linha}:`,
          insertError.message,
        );

        linhasComErro.push(newObjetcError);
      }
    }
  } catch (error) {
    console.error(
      `Erro crítico no processamento do arquivo ${uploadId}:`,
      error.message,
    );

    await prisma.uploadedFile.update({
      where: { id: uploadId },
      data: {
        status: UploadStatus.FAILED,
        errorMessage: error.message,
      },
    });
  } finally {
    let statusFinal = UploadStatus.FAILED;

    if (linhasSucesso > 0 && linhasComErro.length === 0) {
      statusFinal = UploadStatus.SUCCESS;
    } else if (linhasSucesso > 0 && linhasComErro.length > 0) {
      statusFinal = UploadStatus.PARTIAL_SUCCESS;
    }

    await prisma.uploadedFile.update({
      where: { id: uploadId },
      data: {
        status: statusFinal,
        errorMessage: linhasComErro.length
          ? JSON.stringify(linhasComErro, null, 2)
          : null,
      },
    });

    console.log(
      `Processamento do arquivo ${uploadId} concluído. Linhas com sucesso: ${linhasSucesso}, Linhas com erro: ${linhasComErro.length}`,
    );
  }
}

export default processFile;
