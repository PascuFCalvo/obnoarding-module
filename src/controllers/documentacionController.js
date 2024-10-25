const {
  Documentacion,
  Sociedad,
  Usuario,
  UsuarioDocumentacion,
  SociedadDocumentacion,
  GrupoDocumentacion,
  DepartamentoDocumentacion,
  sequelize,
  Grupo,
  Departamento,
} = require("../models");
const path = require("path");
const fs = require("fs");

const uploadDocumentacion = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo." });
    }

    console.log("Datos recibidos en req.body:", req.body);

    const { users, descripcion, nombre, sociedad, groups, departments } =
      req.body;
    const sociedadId = sociedad ? JSON.parse(sociedad) : null;
    const userIds = users ? JSON.parse(users) : [];
    const grupoIds = groups ? JSON.parse(groups) : [];
    const departamentoIds = departments ? JSON.parse(departments) : [];

    if (!sociedadId) {
      throw new Error("ID de Sociedad no válido");
    }

    const sociedadRecord = await Sociedad.findByPk(sociedadId);
    if (!sociedadRecord) {
      return res.status(404).json({ error: "Sociedad no encontrada." });
    }

    const sociedadNombre = sociedadRecord.nombre;
    const extension = path.extname(req.file.originalname);
    const newFileName = `${nombre}${extension}`;
    const dirPath = `uploads/${sociedadNombre}`;

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const oldPath = `uploads/${req.file.filename}`;
    const newPath = `${dirPath}/${newFileName}`;
    fs.renameSync(oldPath, newPath);

    const newDocument = await Documentacion.create(
      {
        nombre: newFileName,
        descripcion: descripcion,
        url: newPath,
        fecha_subida: new Date(),
        sociedad_id: sociedadId,
      },
      { transaction }
    );

    console.log("Usuarios a asociar:", userIds);
    for (const userId of userIds) {
      await UsuarioDocumentacion.create(
        {
          id_usuario: userId,
          documento_id: newDocument.id,
          acceso: true,
          firma: false,
          fecha_acceso: new Date(),
        },
        { transaction }
      );
    }

    await SociedadDocumentacion.create(
      {
        sociedad_id: sociedadId,
        documento_id: newDocument.id,
        acceso: true,
        firma: false,
        fecha_acceso: new Date(),
      },
      { transaction }
    );

    console.log("Grupos a asociar:", grupoIds);
    if (grupoIds.length > 0) {
      for (const grupoId of grupoIds) {
        await GrupoDocumentacion.create(
          {
            grupo_id: grupoId,
            documento_id: newDocument.id,
            acceso: true,
            firma: false,
            fecha_acceso: new Date(),
          },
          { transaction }
        );
      }
    } else {
      console.log("No hay grupos para asociar.");
    }

    console.log("Departamentos a asociar:", departamentoIds);
    if (departamentoIds.length > 0) {
      for (const departamentoId of departamentoIds) {
        await DepartamentoDocumentacion.create(
          {
            departamento_id: departamentoId,
            documento_id: newDocument.id,
            acceso: true,
            firma: false,
            fecha_acceso: new Date(),
          },
          { transaction }
        );
      }
    } else {
      console.log("No hay departamentos para asociar.");
    }

    await transaction.commit();
    res.status(201).json(newDocument);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al subir el archivo:", error);
    res.status(500).json({ error: "Error al subir el archivo." });
  }
};

module.exports = {
  uploadDocumentacion,
};

const getDocumentacionPorSociedad = async (req, res) => {
  const sociedadId = req.params.sociedadId;

  try {
    const documentacion = await SociedadDocumentacion.findAll({
      where: { sociedad_id: sociedadId },
      include: [
        {
          model: Documentacion,
          as: "documentacion",
          attributes: [
            "id",
            "nombre",
            "descripcion",
            "fecha_subida",
            "is_firmado",
            "url",
          ],
        },
        {
          model: Sociedad,
          as: "sociedad",
          attributes: ["id", "nombre"],
        },
      ],
    });

    if (!documentacion.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron documentos para esta sociedad." });
    }

    res.status(200).json(documentacion);
  } catch (error) {
    console.error("Error al obtener documentación:", error);
    res.status(500).json({ message: "Error al obtener documentación" });
  }
};

const getDocumentosPorUsuarioYsociedad = async (req, res) => {
  const sociedadId = req.params.sociedadId;

  try {
    const documentos = await UsuarioDocumentacion.findAll({
      include: [
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nombre", "apellido"],
        },
        {
          model: Documentacion,
          as: "documento",
          where: { sociedad_id: sociedadId },
          include: [
            {
              model: Sociedad,
              as: "sociedad",
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
      attributes: ["firma", "url"], // Incluye 'firma' y 'url' directamente en el modelo
    });

    if (!documentos.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron documentos para esta sociedad." });
    }

    res.status(200).json(documentos);
  } catch (error) {
    console.error("Error al obtener documentos por usuario y sociedad:", error);
    res.status(500).json({ message: "Error al obtener documentación." });
  }
};

const getDocumentosPorGrupoYsociedad = async (req, res) => {
  const sociedadId = req.params.sociedadId;

  try {
    console.log(
      "Obteniendo documentos de grupos para la sociedad ID:",
      sociedadId
    );

    // Verifica las asociaciones definidas en el modelo y los aliases
    const documentos = await GrupoDocumentacion.findAll({
      include: [
        {
          model: Grupo,
          as: "grupo",
          attributes: ["id", "nombre"],
          include: [
            {
              model: Departamento,
              as: "departamento",
              attributes: ["id", "nombre"],
            },
          ],
        },
        {
          model: Documentacion,
          as: "documento",
          where: { sociedad_id: sociedadId },
          attributes: [
            "id",
            "nombre",
            "descripcion",
            "fecha_subida",
            "is_firmado",
            "url",
          ],
          include: [
            {
              model: Sociedad,
              as: "sociedad",
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });

    if (!documentos.length) {
      console.log("No se encontraron documentos asociados a los grupos.");
      return res
        .status(404)
        .json({ message: "No se encontraron documentos para esta sociedad." });
    }

    console.log("Documentos encontrados:", documentos.length);
    res.status(200).json(documentos);
  } catch (error) {
    console.error("Error al obtener documentos por grupo y sociedad:", error);
    res.status(500).json({
      message: "Error al obtener documentos por grupo y sociedad.",
      error: error.message,
    });
  }
};

const getDocumentosPorDepartamentoYsociedad = async (req, res) => {
  const sociedadId = req.params.sociedadId;

  try {
    const documentos = await DepartamentoDocumentacion.findAll({
      include: [
        {
          model: Departamento,
          as: "departamento",
          attributes: ["id", "nombre"],
          include: [
            {
              model: Grupo,
              as: "grupos",
              attributes: ["id", "nombre"],
            },
          ],
        },
        {
          model: Documentacion,
          as: "documento",
          where: { sociedad_id: sociedadId },
          attributes: [
            "id",
            "nombre",
            "descripcion",
            "fecha_subida",
            "is_firmado",
            "url",
          ],
          include: [
            {
              model: Sociedad,
              as: "sociedad",
              attributes: ["id", "nombre"],
            },
          ],
        },
      ],
    });

    if (!documentos.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron documentos para esta sociedad." });
    }

    res.status(200).json(documentos);
  } catch (error) {
    console.error(
      "Error al obtener documentos por departamento y sociedad:",
      error
    );
    res.status(500).json({ message: "Error al obtener documentación." });
  }
};

module.exports = {
  uploadDocumentacion,
  getDocumentacionPorSociedad,
  getDocumentosPorUsuarioYsociedad,
  getDocumentosPorGrupoYsociedad,
  getDocumentosPorDepartamentoYsociedad,
};
