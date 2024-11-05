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
    console.log("Datos recibidos en req.body:", req.body);

    const {
      users,
      descripcion,
      nombre,
      sociedad,
      period,
      departments,
      groups,
      course,
    } = req.body;

    const sociedadId = sociedad ? JSON.parse(sociedad) : null;
    const userIds = users ? JSON.parse(users) : [];
    const departamentoIds = departments ? JSON.parse(departments) : [];
    const grupoIds = groups ? JSON.parse(groups) : [];
    const periodo = period ? new Date(period) : null;
    const curso = course || null;
    const urlcurso = `https://academy.turiscool.com/course/${curso}`;

    if (!sociedadId) {
      throw new Error("ID de Sociedad no válido");
    }

    const sociedadRecord = await Sociedad.findByPk(sociedadId);
    if (!sociedadRecord) {
      return res.status(404).json({ error: "Sociedad no encontrada." });
    }

    // Variables para el archivo
    let newFileName = null;
    let newPath = null;
    const sociedadNombre = sociedadRecord.nombre;

    // Manejo del archivo si está presente
    if (req.file) {
      const extension = path.extname(req.file.originalname);
      newFileName = `${nombre}${extension}`;
      const dirPath = `uploads/${sociedadNombre}`;

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const oldPath = `uploads/${req.file.filename}`;
      newPath = `${dirPath}/${newFileName}`;
      fs.renameSync(oldPath, newPath);
    }

    // Crear el registro de documento en la base de datos
    const newDocument = await Documentacion.create(
      {
        nombre: newFileName || nombre, // Si no hay archivo, usar el nombre proporcionado
        descripcion: descripcion,
        url: newPath, // URL solo si el archivo existe
        fecha_subida: new Date(),
        sociedad_id: sociedadId,
        periodo: periodo,
        linkCourse: urlcurso,
      },
      { transaction }
    );

    // Asociar usuarios si están presentes
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

    // Asociar a grupos si están presentes
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

    // Asociar a departamentos si están presentes
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

    // Crear una entrada en SociedadDocumentacion solo si no hay usuarios específicos asignados
    if (
      userIds.length === 0 &&
      grupoIds.length === 0 &&
      departamentoIds.length === 0
    ) {
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
      console.log("Documento asociado a la sociedad en general.");
    } else {
      console.log(
        "Documento asignado a usuarios, grupos o departamentos específicos; no se crea entrada en documentación general."
      );
    }

    await transaction.commit();
    res.status(201).json({ message: "Documentación subida correctamente." });
  } catch (error) {
    console.error("Error al subir documentación:", error);
    await transaction.rollback();
    return res.status(500).json({ error: "Error al subir documentación." });
  }
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
            "periodo",
            "linkCourse",
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
            "periodo",
            "linkCourse",
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
            "periodo",
            "linkCourse",
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
