const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: "admin",
  password: "Qwerty123.",
  server: "DAAB-HP-001",
  database: "InventarioActivos",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

sql
  .connect(config)
  .then((pool) => {
    
    app.use(bodyParser.json());
    
    app.post('/api/login', async (req, res) => {
      console.log('Solicitud de login recibida:', req.body)
      const { usuario, password } = req.body;
      try {
        const user = await pool.request()
          .input('usuario', usuario)
          .query('SELECT * FROM Usuarios WHERE Usuario = @usuario');
    
        if (user.recordset.length === 0) {
          return res.status(401).json({ error: 'Usuario no encontrado' });
        }
    
        const hashedPassword = user.recordset[0].Password;
        console.log('Usuario recuperado de la base de datos:', user.recordset[0]);
        console.log('Contraseña ingresada:', password.trim());
        console.log('Contraseña almacenada:', hashedPassword);
    
        const isValidPassword = await bcrypt.compare(password.trim(), hashedPassword);
        console.log('¿Es válida la contraseña?', isValidPassword);
    
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
        }
    
        const token = jwt.sign({ userId: user.recordset[0].IdUsuario }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
      }
    });

    //Seleccionar los articulos
    app.get("/api/articulos", async (req, res) => {
      try {
        const result = await pool
          .request()
          .query(
            "SELECT Articulos.*, Marcas.NombreM FROM Articulos JOIN Marcas ON Articulos.IdMarca = Marcas.IdMarca"
          );
        res.json(result.recordset);
      } catch (error) {
        console.error("Error al obtener los articulos:", error);
        res.status(500).send("Error al obtener los articulos");
      }
    });

    //Seleccionar Articulos no asignados
    app.get("/api/articulosDisponibles", async (req, res) => {
      try {
        const result = await pool
          .request()
          .query(
            "SELECT * FROM Articulos WHERE EstadoArticulo != 'Asignado' OR EstadoArticulo IS NULL"
          );

        res.status(200).json(result.recordset);
      } catch (error) {
        console.error("Error al obtener los articulos disponibles:", error);
        res.status(500).send("Error al obtener los articulos disponibles");
      }
    });

    //Seleccionar los departamentos
    app.get("/api/departamentos", async (req, res) => {
      try {
        const result = await pool
          .request()
          .query("SELECT * FROM Departamentos");
        res.json(result.recordset);
      } catch (error) {
        console.error("Error al obtener los departamentos:", error);
        res.status(500).send("Error al obtener los departamentos");
      }
    });

    //Agregar un departamento
    app.post("/api/departamentos", async (req, res) => {
      const { NombreD, DescripcionD } = req.body;

      if (!NombreD || !DescripcionD) {
        return res.status(400).send("Por favor, completa todos los campos");
      }

      try {
        await pool
          .request()
          .input("NombreD", NombreD)
          .input("DescripcionD", DescripcionD)
          .query(
            `INSERT INTO Departamentos (NombreD, DescripcionD) VALUES (@NombreD, @DescripcionD)`
          );

        res.status(201).send("Departamento creado exitosamente.");
      } catch (error) {
        console.error("Error al crear el departamento:", error);
        res.status(500).send("Error al crear un departamento")
      }
    });

    //Editar un departamento
    app.put("/api/departamentos/:id", async (req, res) => {
      const { id } = req.params;
      const { NombreD, DescripcionD } = req.body;

      try {
        const result = await pool
          .request()
          .input("IdDepartamento", id)
          .query("SELECT * FROM Departamentos WHERE IdDepartamento = @IdDepartamento");

        if (result.recordset.length === 0) {
          return res.status(404).json({ message: "Departamento no encontrado" });
        }

        await pool
          .request()
          .input("IdDepartamento", id)
          .input("NombreD", NombreD)
          .input("DescripcionD", DescripcionD)
          .query(
            `UPDATE Departamentos SET NombreD = @NombreD, 
                                      DescripcionD = @DescripcionD
                                  WHERE IdDepartamento = @IdDepartamento`
          );

        res.json({ message: "Departamento Actualizado correctamente "});
      } catch (error) {
        console.error("Error al actualizar el departamento", error);
        res.status(500).json({ message: "Ocurrio un error al actualizar el departamento" });
      }
    });

    //Eliminar un Departamento
    app.delete("/api/departamentos/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const result = await pool
          .request()
          .input("IdDepartamento", id)
          .query("SELECT * FROM Departamentos WHERE IdDepartamento = @IdDepartamento");

        if (result.recordset.length === 0) {
          return res.status(404).json({ message: "Departamento no encontrado" });
        }

        await pool 
          .request()
          .input("IdDepartamento", id)
          .query("DELETE FROM Departamentos WHERE IdDepartamento = @IdDepartamento");

        res.status(200).json({ message: "Departamento eliminado exitosamente" });
      } catch (error) {
        console.error("Error al eliminar el departamento", error);
        res.status(500).json({ message: "Ocurrio un error al eliminar el departamento" });
      }
    });

    //Seleccionar los puestos
    app.get("/api/puestos", async (req, res) => {
      try {
        const result = await pool.request().query("SELECT * FROM Puestos");
        res.json(result.recordset);
      } catch (error) {
        console.error("Error al obtener los Puestos:", error);
        res.status(500).send("Error al obtener los Puestos");
      }
    });

    //Agregar un puesto
    app.post("/api/puestos", async (req, res) => {
      const { NombreP, DescripcionP } = req.body;

      if (!NombreP || !DescripcionP) {
        return res.status(400).send("Por favor, completa todos los campos");
      }

      try {
        await pool
          .request()
          .input("NombreP", NombreP)
          .input("DescripcionP", DescripcionP)
          .query(
            `INSERT INTO Puestos (NombreP, DescripcionP) VALUES (@NombreP, @DescripcionP)`
          );

        res.status(201).send("Puesto creado exitosamente.");
      } catch (error) {
        console.error("Error al crear el puesto", error);
        res.status(500).send("Error al crear un puesto")
      }
    });

    //Editar un puesto
    app.put("/api/puestos/:id", async (req, res) => {
      const { id } = req.params;
      const { NombreP, DescripcionP } = req.body;
      
      try {
        const result = await pool
          .request()
          .input("IdPuesto", id)
          .query("SELECT * FROM Puestos WHERE IdPuesto = @IdPuesto");

        if (result.recordset.length === 0) {
          return res.status(404).json({ message: "Puesto no encontrado "});
        }

        await pool
          .request()
          .input("IdPuesto", id)
          .input("NombreP", NombreP)
          .input("DescripcionP", DescripcionP)
          .query(
            `UPDATE Puestos SET NombreP = @NombreP,
                                DescripcionP = @DescripcionP
                            WHERE IdPuesto = @IdPuesto`
          );
        
        res.json({ message: "Puesto Actualizado correctamente "});
      } catch (error) {
        console.error("Error al actualizar el puesto", error);
        res.status(500).json({ message: "Ocurrio un error al actualizar el puesto" });
      }
    });

    //Eliminar un puesto
    app.delete("/api/puestos/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const result = await pool
          .request()
          .input("IdPuesto", id)
          .query("SELECT * FROM Puestos WHERE IdPuesto = @IdPuesto");

        if (result.recordset.length === 0) {
          return res.status(404).json({ message: "Puesto no encontrado" });
        }

        await pool
          .request()
          .input("IdPuesto", id)
          .query("DELETE FROM Puestos WHERE IdPuesto = @IdPuesto");

        res.status(200).json({ message: "Puesto eliminado exitosamente" });
      } catch (error) {
        console.error("Error al eliminar el puesto", error);
        res.status(500).json({ message: "Ocurrio un error al eliminar el puesto" });
      }
    })

    //Seleccionar los usuarios
    app.get("/api/usuarios", async (req, res) => {
      try {
        const result = await pool.request().query("SELECT * FROM Usuarios");
        res.json(result.recordset);
      } catch (error) {
        console.error("Error al obtener los Puestos:", error);
        res.status(500).send("Error al obtener los Puestos");
      }
    });

    //Agregar un usuario
    app.post("/api/usuarios", async (req, res) => {
      const { NombreCompleto, Usuario, Password, TipoUsuario, Estado } =
        req.body;

      // Verificar que todos los campos necesarios están presentes
      if (!NombreCompleto || !Usuario || !Password || !TipoUsuario || !Estado) {
        return res
          .status(400)
          .send("Por favor, completa todos los campos requeridos.");
      }

      try {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHasheada = await bcrypt.hash(Password.trim(), salt);

        // Ejecutar la consulta SQL para agregar el usuario
        await pool
          .request()
          .input("NombreCompleto", NombreCompleto)
          .input("Usuario", Usuario)
          .input("Password", passwordHasheada)
          .input("TipoUsuario", TipoUsuario)
          .input("Estado", Estado)
          .query(
            "INSERT INTO Usuarios (NombreCompleto, Usuario, Password, TipoUsuario, Estado) " +
              "VALUES (@NombreCompleto, @Usuario, @Password, @TipoUsuario, @Estado)"
          );

        // Respuesta de éxito
        res.status(201).send("Usuario creado exitosamente.");
      } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).send("Error al crear el usuario.");
      }
    });

    //Editar un usuario
    app.put("/api/usuarios/:id", async (req, res) => {
      const { id } = req.params;
      const { NombreCompleto, Usuario, TipoUsuario, Estado } = req.body;

      try {
        const result = await pool
          .request()
          .input("IdUsuarios", id)
          .query("SELECT * FROM Usuarios WHERE IdUsuarios = @IdUsuarios");

        if (result.recordset.length === 0) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await pool
          .request()
          .input("IdUsuarios", id)
          .input("NombreCompleto", NombreCompleto)
          .input("Usuario", Usuario)
          .input("TipoUsuario", TipoUsuario)
          .input("Estado", Estado)
          .query(
            `UPDATE Usuarios
            SET NombreCompleto = @NombreCompleto,
                Usuario = @Usuario,
                TipoUsuario = @TipoUsuario,
                Estado = @Estado
            WHERE IdUsuarios = @IdUsuarios`
          );

        res.json({ message: "Usuario actualizado correctamente" });
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res
          .status(500)
          .json({ message: "Ocurrio un error al actualizar el usuario" });
      }
    });

    //Eliminar un usuario
    app.delete("/api/usuarios/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const result = await pool
          .request()
          .input("IdUsuarios", id)
          .query("SELECT * FROM Usuarios WHERE IdUsuarios = @IdUsuarios");

        if (result.recordset.length === 0) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await pool 
          .request()
          .input("IdUsuarios", id)
          .query("DELETE FROM Usuarios WHERE IdUsuarios = @IdUsuarios");

        res.status(200).json({ message: "Usuario eliminado exitosamente" });
      } catch (error) {
        console.error("Error al eliminar el usuario", error);
        res.status(500).json({ message: "Ocurrio un error al eliminar el usuario" });
      }
    });

    //Seleccionar las marcas
    app.get("/api/marcas", async (req, res) => {
      try {
        const result = await pool.request().query("SELECT * FROM Marcas");
        res.json(result.recordset);
      } catch (error) {
        console.error("Error al obtener las Marcas:", error);
        res.status(500).send("Error al obtener las Marcas");
      }
    });
    //Seleccionar los cargos activos
    app.get("/api/cargoActivos", async (req, res) => {
      try {
        const result = await pool
          .request()
          .query(
            `SELECT * FROM CargoActivos WHERE EstadoArticulo = 'Asignado'`
          );
        res.json(result.recordset);
      } catch (error) {
        console.error("Error al obtener los cargos:", error);
        res.status(500).send("Error al obtener los cargos");
      }
    });

    //Agregar un cargo Activo
    app.post("/api/cargoActivos", async (req, res) => {
      const {
        CodigoInventario,
        IdEmpleado,
        IdArticulo,
        fechaAsignacion,
        descripcion,
      } = req.body;

      if (!IdArticulo || !IdEmpleado || !CodigoInventario) {
        return res.status(400).send("Datos faltantes o inválidos");
      }

      const transaction = new sql.Transaction(pool);

      try {
        await transaction.begin();

        const articulo = await transaction
          .request()
          .input("IdArticulo", IdArticulo)
          .query("SELECT * FROM Articulos WHERE IdArticulo = @IdArticulo");

        if (!articulo.recordset.length) {
          await transaction.rollback();
          return res.status(404).send("El articulo no existe.");
        }

        // Inserta en CargoActivos
        await transaction
          .request()
          .input("CodigoInventario", CodigoInventario)
          .input("IdEmpleado", IdEmpleado)
          .input("IdArticulo", IdArticulo)
          .input("FechaAsignacion", fechaAsignacion)
          .input("EstadoArticulo", "Asignado")
          .input("Descripcion", descripcion)
          .query(
            "INSERT INTO CargoActivos (CodigoInventario, IdEmpleado, IdArticulo, FechaAsignacion, EstadoArticulo, Descripcion) VALUES (@CodigoInventario, @IdEmpleado, @IdArticulo, @FechaAsignacion, @EstadoArticulo, @Descripcion)"
          );

        // Actualiza el EstadoArticulo
        await transaction
          .request()
          .input("IdArticulo", IdArticulo)
          .query(
            "UPDATE Articulos SET EstadoArticulo = 'Asignado' WHERE IdArticulo = @IdArticulo"
          );

        await transaction.commit();
        res.status(201).send("Articulo asignado exitosamente");
      } catch (error) {
        await transaction.rollback();
        console.error("Error al asignar el articulo:", error);
        res.status(500).send("Error al asignar el articulo");
      }
    });

    //Seleccionar los cargos activos asignados
    app.get("/api/cargoActivos/:idEmpleado", async (req, res) => {
      const { idEmpleado } = req.params;
      try {
        const result = await pool.request().input("IdEmpleado", idEmpleado)
          .query(`
                    SELECT CargoActivos.IdArticulo, Articulos.NombreA, CargoActivos.EstadoArticulo
                    FROM CargoActivos
                    INNER JOIN Articulos ON CargoActivos.IdArticulo = Articulos.IdArticulo
                    WHERE CargoActivos.IdEmpleado = @IdEmpleado
                    `);

        if (result.recordset.length > 0) {
          res.json(result.recordset);
        } else {
          res
            .status(404)
            .send("No se encontraron articulos asignados para este empleado");
        }
      } catch (error) {
        console.error("Error al obtener los cargos:", error);
        res.status(500).send("Error al obtener los cargos");
      }
    });

    //Seleccionar los Descargos
    app.get("/api/descargos", async (req, res) => {
      try {
        const result = await pool.request().query(`
                SELECT DescargosActivos.IdDescargo, DescargosActivos.FechaDescargo, DescargosActivos.Descripcion, 
                       DescargosActivos.MotivoDescargo, CargoActivos.IdArticulo, CargoActivos.IdEmpleado, 
                       Articulos.NombreA, Empleados.Nombre AS NombreEmpleado
                FROM DescargosActivos
                JOIN CargoActivos ON DescargosActivos.IdCargoActivo = CargoActivos.IdCargo
                JOIN Articulos ON CargoActivos.IdArticulo = Articulos.IdArticulo
                JOIN Empleados ON CargoActivos.IdEmpleado = Empleados.IdEmpleado
                `);

        res.json(result.recordset);
      } catch (error) {
        console.error("Error al obtener los descargos:", error);
        res.status(500).send("Error al obtener los descargos");
      }
    });

    //Agregar Descargos
    app.post("/api/descargos", async (req, res) => {
      const {
        IdEmpleado,
        IdArticulo,
        FechaDescargo,
        idCargoActivo,
        MotivoDescargo,
        Descripcion,
      } = req.body;

      console.log("Datos Recibidos:", req.body);

      // Validación de los datos recibidos
      if (!IdEmpleado || !IdArticulo || !idCargoActivo) {
        return res
          .status(400)
          .json({ error: "Falta el IdEmpleado, IdArticulo o idCargoActivo" });
      }

      try {
        // Actualizar el estado del artículo
        const updateQuery = `
            UPDATE CargoActivos
            SET EstadoArticulo = 'Desasignado'
            WHERE IdCargo = @idCargoActivo
          `;

        await pool
          .request()
          .input("idCargoActivo", sql.Int, idCargoActivo) // Se asegura de que 'idCargoActivo' sea un entero
          .query(updateQuery);

        // Insertar el descargo
        const insertDescargoQuery = `
            INSERT INTO Descargos (IdEmpleado, IdArticulo, FechaDescargo, MotivoDescargo, Descripcion, idCargoActivo)
            VALUES (@IdEmpleado, @IdArticulo, @FechaDescargo, @MotivoDescargo, @Descripcion, @idCargoActivo)
          `;

        await pool
          .request()
          .input("IdEmpleado", sql.Int, IdEmpleado)
          .input("IdArticulo", sql.Int, IdArticulo)
          .input("FechaDescargo", sql.Date, FechaDescargo)
          .input("MotivoDescargo", sql.NVarChar, MotivoDescargo)
          .input("Descripcion", sql.NVarChar, Descripcion)
          .input("idCargoActivo", sql.Int, idCargoActivo) // Asegura que este campo sea entero
          .query(insertDescargoQuery);

        res.status(201).json({ message: "Artículo desasignado exitosamente" });
      } catch (error) {
        console.error("Error al desasignar el artículo:", error);
        res.status(500).send("Error al desasignar el artículo");
      }
    });

    //Agregar Articulos
    app.post("/api/articulos", async (req, res) => {
      const {
        nombre,
        codigoA,
        idMarca,
        modelo,
        precioCompra,
        fechaCompra,
        numSerie,
        descripcion,
      } = req.body;

      try {
        await pool
          .request()
          .input("NombreA", nombre)
          .input("CodigoA", codigoA)
          .input("IdMarca", idMarca)
          .input("Modelo", modelo)
          .input("PrecioCompra", precioCompra)
          .input("FechaCompra", fechaCompra)
          .input("NumeroSerie", numSerie)
          .input("EstadoArticulo", "Pendiente")
          .input("DescripcionA", descripcion).query(`
                  INSERT INTO Articulos (NombreA, CodigoA, IdMarca, Modelo, PrecioCompra, FechaCompra, NumeroSerie, EstadoArticulo, DescripcionA) 
                  VALUES (@NombreA, @codigoA, @IdMarca, @Modelo, @PrecioCompra, @FechaCompra, @NumeroSerie, @EstadoArticulo, @DescripcionA)
                `);

        res.status(201).send("Articulo creado exitosamente");
      } catch (error) {
        console.error("Error al crear el articulo:", error);
        res.status(500).send("Error al crear el articulo");
      }
    });

    //Editar Articulo
    app.put("/api/articulos/:idArticulo", async (req, res) => {
      const { idArticulo } = req.params;
      const {
        nombre,
        codigoA,
        idMarca,
        modelo,
        precioCompra,
        fechaCompra,
        numSerie,
        descripcion,
      } = req.body;

      try {
        await pool
          .request()
          .input("IdArticulo", idArticulo)
          .input("NombreA", nombre)
          .input("CodigoA", codigoA)
          .input("IdMarca", idMarca)
          .input("Modelo", modelo)
          .input("PrecioCompra", precioCompra)
          .input("FechaCompra", fechaCompra)
          .input("NumeroSerie", numSerie)
          .input("DescripcionA", descripcion).query(`
                    UPDATE Articulos
                    SET NombreA = @NombreA, CodigoA = @CodigoA, IdMarca = @IdMarca, Modelo = @Modelo,
                        PrecioCompra = @PrecioCompra, FechaCompra = @FechaCompra, NumeroSerie = @NumeroSerie,
                        DescripcionA = @DescripcionA
                    WHERE IdArticulo = @IdArticulo
                `);

        res.status(200).send("Articulo actualizado exitosamente");
      } catch (error) {
        console.error("Error al actualizar el articulo:", error);
        res.status(500).send("Error al actualizar el articulo");
      }
    });

    //Eliminar Articulo
    app.delete("/api/articulos/:id", async (req, res) => {
      const idArticulo = req.params.id;

      try {
        await pool
          .request()
          .input("IdArticulo", idArticulo)
          .query("DELETE FROM Articulos WHERE IdArticulo = @IdArticulo");

        res
          .status(200)
          .send(`Articulo con ID ${idArticulo} eliminado correctamente`);
      } catch (error) {
        console.error("Error al eliminar el articulo:", error);
        res.status(500).send("Error al eliminar el articulo");
      }
    });

    //Seleccionar los Empleados
    app.get("/api/empleados", async (req, res) => {
      try {
        const result = await pool.request().query(`
            SELECT Empleados.*, Departamentos.NombreD, Puestos.NombreP 
            FROM Empleados 
            JOIN Departamentos ON Empleados.IdDepartamento = Departamentos.IdDepartamento 
            JOIN Puestos ON Empleados.IdPuesto = Puestos.IdPuesto;
          `);
        res.json(result.recordset);
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
        res.status(500).send("Error al obtener los empleados");
      }
    });

    //Agregar Empleados
    app.post("/api/empleados", async (req, res) => {
      const {
        nombre,
        identidad,
        genero,
        telefono,
        correo,
        direccion,
        idDepartamento,
        idPuesto,
      } = req.body;

      if (
        !nombre ||
        !identidad ||
        !genero ||
        !telefono ||
        !correo ||
        !direccion ||
        !idDepartamento ||
        !idPuesto
      ) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios." });
      }

      try {
        await pool
          .request()
          .input("Nombre", sql.VarChar, nombre)
          .input("Identidad", sql.VarChar, identidad)
          .input("Genero", sql.VarChar, genero)
          .input("Telefono", sql.VarChar, telefono)
          .input("Correo", sql.VarChar, correo)
          .input("Direccion", sql.VarChar, direccion)
          .input("IdDepartamento", sql.Int, idDepartamento)
          .input("IdPuesto", sql.Int, idPuesto).query(`
                INSERT INTO Empleados (Nombre, Identidad, Genero, Telefono, Correo, Direccion, IdDepartamento, IdPuesto)
                VALUES (@Nombre, @Identidad, @Genero, @Telefono, @Correo, @Direccion, @IdDepartamento, @IdPuesto)      
            `);

        res.status(201).json({ message: "Empleado agregado exitosamente" });
      } catch (error) {
        console.error("Error al egregar el empleado:", error);
        res.status(500).send("Error al agregar el empleado");
      }
    });

    //Editar Empleado
    app.put("/api/empleados/:id", async (req, res) => {
      const { id } = req.params;
      const {
        nombre,
        identidad,
        genero,
        telefono,
        correo,
        direccion,
        idDepartamento,
        idPuesto,
      } = req.body;

      if (
        !nombre ||
        !identidad ||
        !genero ||
        !telefono ||
        !correo ||
        !direccion ||
        !idDepartamento ||
        !idPuesto
      ) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios." });
      }

      try {
        await pool
          .request()
          .input("IdEmpleado", sql.Int, id)
          .input("Nombre", sql.VarChar, nombre)
          .input("Identidad", sql.VarChar, identidad)
          .input("Genero", sql.VarChar, genero)
          .input("Telefono", sql.VarChar, telefono)
          .input("Correo", sql.VarChar, correo)
          .input("Direccion", sql.VarChar, direccion)
          .input("IdDepartamento", sql.Int, idDepartamento)
          .input("IdPuesto", sql.Int, idPuesto).query(`
                   UPDATE Empleados
                   SET Nombre = @Nombre, Identidad = @Identidad, Genero = @Genero, Telefono = @Telefono,
                       Correo = @Correo, Direccion = @Direccion, IdDepartamento = @IdDepartamento, IdPuesto = @IdPuesto
                    WHERE IdEmpleado = @IdEmpleado
                `);

        res.json({ message: "Empleado actualizado exitosamente" });
      } catch (error) {
        console.error("Error al actualizar el empleado:", error);
        res.status(500).send("Error al actualizar el empleado");
      }
    });

    //Eliminar Empleado
    app.delete("/api/empleados/:id", async (req, res) => {
      const idEmpleado = req.params.id;

      try {
        await pool
          .request()
          .input("IdEmpleado", idEmpleado)
          .query("DELETE FROM Empleados WHERE IdEmpleado = @IdEmpleado");

        res
          .status(200)
          .send(`Empleado con ID ${idEmpleado} eliminado correctamente`);
      } catch (error) {
        console.error("Error al eliminar el empleado:", error);
        res.status(500).send("Error al eliminar el empleado");
      }
    });

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar a SQL Server:", err);
  });

// async function connectToDatabase() {
//     try {
//         let pool = await sql.connect(config);
//         console.log('Conexion exitosa a SQL Server');

//         const result = await pool.request().query('SELECT * FROM empleados');
//         console.log(result);
//     } catch (err) {
//         console.log('Error al conectar a SQL Server:', err);
//     }
// }

//connectToDatabase();
