"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Documentacion",
      [
        {
          nombre: "Contrato Cliente A",
          descripcion: "Contrato de servicios para el Cliente A",
          fecha_subida: "2024-01-15",
          is_firmado: false,
          url: "url_contrato_cliente_a.pdf",
          tipo_id: 1,
        },
        {
          nombre: "Política de Seguridad 2024",
          descripcion: "Directrices de seguridad de TechSolutions para 2024",
          fecha_subida: "2024-02-10",
          is_firmado: true,
          url: "url_politica_seguridad_2024.pdf",
          tipo_id: 2,
        },
        {
          nombre: "Informe Técnico - Proyecto B",
          descripcion: "Informe técnico del Proyecto B",
          fecha_subida: "2024-03-01",
          is_firmado: true,
          url: "url_informe_tecnico_proyecto_b.pdf",
          tipo_id: 3,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Documentacion", null, {});
  },
};
