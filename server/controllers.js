const BD = require('./database');

const Conectar = async (req, res) => {
  const { BDS } = req.body;
  const { origin } = req.query;
  console.log(req.body)
  try {
    const DataBase = new BD(BDS.host, BDS.user, BDS.bd, BDS.port, BDS.password);
    if (origin == 1) {
      const tablas = await DataBase.conection.query(`
      SELECT table_name
  FROM information_schema.tables
  WHERE table_schema='public'
  AND table_type='BASE TABLE';
      `)
      console.log(tablas.rows);
      return res.json({ access: true, tablasBd: tablas.rows })
    }
    await DataBase.conection.query(`
      SELECT table_name
  FROM information_schema.tables
  WHERE table_schema='public'
  AND table_type='BASE TABLE';
      `)
    return res.json({ access: true })

  } catch (error) {
    console.log(error.message)
    return res.json({ access: false, mensaje: error.message })
  }
}

const crearExtencion = async (req, res) => {
  try {
    const { BDS } = req.body;
    const DataBase = new BD(BDS.host, BDS.user, BDS.bd, BDS.port, BDS.password);
    const response = await DataBase.conection.query(`create extension dblink;`);
    console.log(response)
    res.json({ access: true, mensaje: "Extencion Creada" })
  } catch (error) {
    console.log(error.message)
    res.json({ access: false, mensaje: error.message })
  }
}

const Sincronizar = async (req, res) => {
  try {
    const { BD1, BD2, tablas } = req.body;
    this.DataBaseUno = new BD(BD1.host, BD1.user, BD1.bd, BD1.port, BD1.password);
    this.DataBaseDos = new BD(BD2.host, BD2.user, BD2.bd, BD2.port, BD2.password);

    let llavesForaneas = []
    let llavesForaneas2 = []
    const Llaves1 = await this.DataBaseUno.conection.query(`
    SELECT tc.table_name,
    tc.constraint_name,
     tc.constraint_type,
     kcu.column_name,
     tc.is_deferrable,
     tc.initially_deferred,
     rc.match_option AS match_type,
     rc.update_rule AS on_update,
     rc.delete_rule AS on_delete,
     ccu.table_name AS references_table,
     ccu.column_name AS references_field
     FROM information_schema.table_constraints tc
     LEFT JOIN information_schema.key_column_usage kcu
     ON tc.constraint_catalog = kcu.constraint_catalog
     AND tc.constraint_schema = kcu.constraint_schema
     AND tc.constraint_name = kcu.constraint_name
     LEFT JOIN information_schema.referential_constraints rc
     ON tc.constraint_catalog = rc.constraint_catalog
     AND tc.constraint_schema = rc.constraint_schema
     AND tc.constraint_name = rc.constraint_name
     LEFT JOIN information_schema.constraint_column_usage ccu
     ON rc.unique_constraint_catalog = ccu.constraint_catalog
    AND rc.unique_constraint_schema = ccu.constraint_schema
     AND rc.unique_constraint_name = ccu.constraint_name
     WHERE lower(tc.constraint_type) in ('foreign key', 'primary key')
     ORDER BY tc.table_name
    `);
    for (let name of tablas) {
      for (let valor of Llaves1.rows) {
        if (name === valor.table_name && valor.constraint_type == 'FOREIGN KEY') {
          llavesForaneas.push({
            tabla: valor.table_name,
            llave: valor.constraint_name,
            nombre_columna: valor.column_name,
            referencia_table: valor.references_table,
            referencia_columna: valor.references_field
          });
        }
      }
    }

    const Llaves2 = await this.DataBaseDos.conection.query(`
    SELECT tc.table_name,
    tc.constraint_name,
     tc.constraint_type,
     kcu.column_name,
     tc.is_deferrable,
     tc.initially_deferred,
     rc.match_option AS match_type,
     rc.update_rule AS on_update,
     rc.delete_rule AS on_delete,
     ccu.table_name AS references_table,
     ccu.column_name AS references_field
     FROM information_schema.table_constraints tc
     LEFT JOIN information_schema.key_column_usage kcu
     ON tc.constraint_catalog = kcu.constraint_catalog
     AND tc.constraint_schema = kcu.constraint_schema
     AND tc.constraint_name = kcu.constraint_name
     LEFT JOIN information_schema.referential_constraints rc
     ON tc.constraint_catalog = rc.constraint_catalog
     AND tc.constraint_schema = rc.constraint_schema
     AND tc.constraint_name = rc.constraint_name
     LEFT JOIN information_schema.constraint_column_usage ccu
     ON rc.unique_constraint_catalog = ccu.constraint_catalog
    AND rc.unique_constraint_schema = ccu.constraint_schema
     AND rc.unique_constraint_name = ccu.constraint_name
     WHERE lower(tc.constraint_type) in ('foreign key', 'primary key')
     ORDER BY tc.table_name
    `);


    for (let name of tablas) {
      for (let valor of Llaves2.rows) {
        if (name === valor.table_name && valor.constraint_type == 'FOREIGN KEY') {
          llavesForaneas2.push({
            tabla: valor.table_name,
            llave: valor.constraint_name,
            nombre_columna: valor.column_name,
            referencia_table: valor.references_table,
            referencia_columna: valor.references_field
          });
        }
      }
    }

    console.log("llaves de la bd 1", llavesForaneas)
    console.log("llaves de la bd 2", llavesForaneas2)

    const Existencia = await this.DataBaseDos.tablasExistentes(tablas, tablas.length);
    console.log(`Hay ${Existencia.existentes.length} tablas existentes`)
    console.log(`Hay ${Existencia.noExistentes.length} tablas no existentes`)

    if (Existencia.noExistentes.length > 0) {
      const crear = await this.DataBaseDos.crearTabla(Existencia.noExistentes, Existencia.noExistentes.length,
        this.DataBaseUno, BD1.bd, BD1.user, BD1.password);
      console.log(crear);

      const agregarPrimaryKey = await this.DataBaseDos.agregarPrimaryKey(Existencia.noExistentes, this.DataBaseUno);
      console.log(agregarPrimaryKey)

      const agregarForaneas = await this.DataBaseDos.agregarForanea(tablas, llavesForaneas2, llavesForaneas2.length);
      console.log(agregarForaneas)
    }

    if (Existencia.existentes.length > 0) {

      // const eliminarForaneas = await this.DataBaseDos.eliminarForaneas(tablas, llavesForaneas2, llavesForaneas2.length)
      // console.log("eliminar foraneas", eliminarForaneas)

      const actualizar = await this.DataBaseDos.actualizarTabla(Existencia.existentes, Existencia.existentes.length,
        this.DataBaseUno, BD1.bd, BD1.user, BD1.password);
      console.log(actualizar);

      const agregarPrimaryKey = await this.DataBaseDos.agregarPrimaryKey(Existencia.existentes, this.DataBaseUno);
      console.log(agregarPrimaryKey)

      const agregarForaneas = await this.DataBaseDos.agregarForanea(tablas, llavesForaneas2, llavesForaneas2.length);
      console.log(agregarForaneas)

    }
    return res.json({ access: true, mensaje: "Sincronizacion exitosa" })
  } catch (error) {
    console.log(error.message)
    return res.json({ access: false, mensaje: error.message })
  }
}

module.exports = { Conectar, crearExtencion, Sincronizar };
