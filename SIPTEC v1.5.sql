--------------------------------------------------
-- LIMPIEZA (opcional si ya existen tablas)
--------------------------------------------------
BEGIN EXECUTE IMMEDIATE 'DROP TABLE DETALLE_PRESTAMO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PRESTAMO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE SOLICITUD_PRESTAMO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE INVENTARIO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE MATERIAL CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE CATEGORIA_MATERIAL CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE AREA_MATERIAL CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE ESTADO_PRESTAMO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE USUARIO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE ROLES CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE PERMISO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE ROL_PERMISO CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

--------------------------------------------------
-- SECUENCIAS
--------------------------------------------------
CREATE SEQUENCE SEC_ROLES START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_USUARIOS START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_PERMISO START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_CATEGORIA START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_AREA START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_MATERIAL START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_INVENTARIO START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_ESTADO_PRESTAMO START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_SOLICITUD START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_PRESTAMO START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_DETALLE START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE SEC_INSTITUCIONES START WITH 1 INCREMENT BY 1;

--------------------------------------------------
-- ROLES
--------------------------------------------------
CREATE TABLE ROLES(
    idRol NUMBER PRIMARY KEY,
    nombreRol VARCHAR2(20) UNIQUE NOT NULL
);

INSERT INTO ROLES VALUES (SEC_ROLES.NEXTVAL,'ADMINISTRADOR');
INSERT INTO ROLES VALUES (SEC_ROLES.NEXTVAL,'EMPLEADO');
INSERT INTO ROLES VALUES (SEC_ROLES.NEXTVAL,'IT');

--------------------------------------------------
-- INSTITUCION
--------------------------------------------------
CREATE TABLE INSTITUCIONES(
    idInstitucion NUMBER PRIMARY KEY,
    nombreInstitucion VARCHAR2(20) UNIQUE NOT NULL
);

INSERT INTO INSTITUCIONES VALUES (SEC_INSTITUCIONES.NEXTVAL,'ITR');
INSERT INTO INSTITUCIONES VALUES (SEC_INSTITUCIONES.NEXTVAL,'CFP');

--------------------------------------------------
-- USUARIO
--------------------------------------------------
CREATE TABLE USUARIOS(
    idUsuario NUMBER PRIMARY KEY,
    nombreUsuario VARCHAR2(30) NOT NULL,
    apellidoUsuario VARCHAR2(30) NOT NULL,
    correoUsuario VARCHAR2(60) UNIQUE NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    idRol NUMBER NOT NULL,
    idInstitucion NUMBER NOT NULL,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (idRol) REFERENCES ROLES(idRol),
    CONSTRAINT fk_usuario_Institucion FOREIGN KEY (idInstitucion) REFERENCES INSTITUCIONES(idInstitucion)
);

--------------------------------------------------
-- HASH PASSWORD
--------------------------------------------------
CREATE OR REPLACE FUNCTION hash_password(p_password VARCHAR2)
RETURN VARCHAR2 IS
BEGIN
    RETURN STANDARD_HASH(p_password, 'SHA256');
END;
/

--------------------------------------------------
-- PERMISOS (RBAC)
--------------------------------------------------
CREATE TABLE PERMISO(
    idPermiso NUMBER PRIMARY KEY,
    nombrePermiso VARCHAR2(50) UNIQUE NOT NULL
);

CREATE TABLE ROL_PERMISO(
    idRol NUMBER,
    idPermiso NUMBER,
    CONSTRAINT pk_rol_permiso PRIMARY KEY (idRol, idPermiso),
    CONSTRAINT fk_rp_rol FOREIGN KEY (idRol) REFERENCES ROLES(idRol),
    CONSTRAINT fk_rp_permiso FOREIGN KEY (idPermiso) REFERENCES PERMISO(idPermiso)
);

-- PERMISOS
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'crear_usuario');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'editar_usuario');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'eliminar_usuario');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'ver_inventario');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'agregar_equipo');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'actualizar_estado_equipo');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'solicitar_prestamo');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'aprobar_prestamo');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'rechazar_prestamo');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'reportar_danio');
INSERT INTO PERMISO VALUES (SEC_PERMISO.NEXTVAL,'subir_imagen_reporte');

-- ADMIN = todos
INSERT INTO ROL_PERMISO
SELECT r.idRol, p.idPermiso FROM ROLES r, PERMISO p
WHERE r.nombreRol = 'ADMINISTRADOR';

-- EMPLEADO
INSERT INTO ROL_PERMISO
SELECT r.idRol, p.idPermiso FROM ROLES r, PERMISO p
WHERE r.nombreRol = 'EMPLEADO'
AND p.nombrePermiso IN ('ver_inventario','solicitar_prestamo','reportar_danio','subir_imagen_reporte');

-- IT
INSERT INTO ROL_PERMISO
SELECT r.idRol, p.idPermiso FROM ROLES r, PERMISO p
WHERE r.nombreRol = 'IT'
AND p.nombrePermiso IN ('ver_inventario','agregar_equipo','actualizar_estado_equipo','reportar_danio');

--------------------------------------------------
-- CATEGORIA
--------------------------------------------------
CREATE TABLE CATEGORIA_MATERIAL(
    idCategoria NUMBER PRIMARY KEY,
    nombreCategoria VARCHAR2(50) NOT NULL
);

INSERT INTO CATEGORIA_MATERIAL VALUES (SEC_CATEGORIA.NEXTVAL,'Electrónico');
INSERT INTO CATEGORIA_MATERIAL VALUES (SEC_CATEGORIA.NEXTVAL,'Mecánico');

--------------------------------------------------
-- AREA
--------------------------------------------------
CREATE TABLE AREA_MATERIAL(
    idArea NUMBER PRIMARY KEY,
    nombreArea VARCHAR2(50) NOT NULL
);

INSERT INTO AREA_MATERIAL VALUES (SEC_AREA.NEXTVAL,'Laboratorio');
INSERT INTO AREA_MATERIAL VALUES (SEC_AREA.NEXTVAL,'Área Técnica');

--------------------------------------------------
-- MATERIAL
--------------------------------------------------
CREATE TABLE MATERIAL(
    idMaterial NUMBER PRIMARY KEY,
    nombreMaterial VARCHAR2(50) NOT NULL,
    descripcionMaterial CLOB,
    idCategoria NUMBER,
    idArea NUMBER,
    CONSTRAINT fk_categoria FOREIGN KEY (idCategoria) REFERENCES CATEGORIA_MATERIAL(idCategoria),
    CONSTRAINT fk_area FOREIGN KEY (idArea) REFERENCES AREA_MATERIAL(idArea)
);

--------------------------------------------------
-- INVENTARIO
--------------------------------------------------
CREATE TABLE INVENTARIO(
    idInventario NUMBER PRIMARY KEY,
    idMaterial NUMBER NOT NULL,
    codigoInventario VARCHAR2(30) UNIQUE,
    estado VARCHAR2(20),
    fecha_adquisicion DATE,
    CONSTRAINT fk_material_inv FOREIGN KEY (idMaterial) REFERENCES MATERIAL(idMaterial)
);

--------------------------------------------------
-- ESTADOS PRESTAMO
--------------------------------------------------
CREATE TABLE ESTADO_PRESTAMO(
    idEstado NUMBER PRIMARY KEY,
    nombreEstado VARCHAR2(20)
);

INSERT INTO ESTADO_PRESTAMO VALUES (SEC_ESTADO_PRESTAMO.NEXTVAL,'PENDIENTE');
INSERT INTO ESTADO_PRESTAMO VALUES (SEC_ESTADO_PRESTAMO.NEXTVAL,'APROBADO');
INSERT INTO ESTADO_PRESTAMO VALUES (SEC_ESTADO_PRESTAMO.NEXTVAL,'RECHAZADO');
INSERT INTO ESTADO_PRESTAMO VALUES (SEC_ESTADO_PRESTAMO.NEXTVAL,'ENTREGADO');
INSERT INTO ESTADO_PRESTAMO VALUES (SEC_ESTADO_PRESTAMO.NEXTVAL,'DEVUELTO');

--------------------------------------------------
-- SOLICITUD
--------------------------------------------------
CREATE TABLE SOLICITUD_PRESTAMO(
    idSolicitud NUMBER PRIMARY KEY,
    idUsuario NUMBER,
    fechaSolicitud DATE DEFAULT SYSDATE,
    estado NUMBER,
    CONSTRAINT fk_solicitud_usuario FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario),
    CONSTRAINT fk_solicitud_estado FOREIGN KEY (estado) REFERENCES ESTADO_PRESTAMO(idEstado)
);

--------------------------------------------------
-- PRESTAMO
--------------------------------------------------
CREATE TABLE PRESTAMO(
    idPrestamo NUMBER PRIMARY KEY,
    idSolicitud NUMBER,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL,
    estado NUMBER,
    CONSTRAINT fk_prestamo_solicitud FOREIGN KEY (idSolicitud) REFERENCES SOLICITUD_PRESTAMO(idSolicitud),
    CONSTRAINT fk_prestamo_estado FOREIGN KEY (estado) REFERENCES ESTADO_PRESTAMO(idEstado)
);

--------------------------------------------------
-- DETALLE
--------------------------------------------------
CREATE TABLE DETALLE_PRESTAMO(
    idDetalle NUMBER PRIMARY KEY,
    idPrestamo NUMBER,
    idInventario NUMBER,
    cantidad NUMBER DEFAULT 1,
    CONSTRAINT fk_detalle_prestamo FOREIGN KEY (idPrestamo) REFERENCES PRESTAMO(idPrestamo),
    CONSTRAINT fk_detalle_inventario FOREIGN KEY (idInventario) REFERENCES INVENTARIO(idInventario)
);

--------------------------------------------------
-- TRIGGER (1 MES)
--------------------------------------------------
CREATE OR REPLACE TRIGGER trg_prestamo_fechas
BEFORE INSERT OR UPDATE ON PRESTAMO
FOR EACH ROW
BEGIN
    IF :NEW.fechaFin <= :NEW.fechaInicio THEN
        RAISE_APPLICATION_ERROR(-20001,'Fecha inválida');
    END IF;

    IF :NEW.fechaFin > ADD_MONTHS(:NEW.fechaInicio,1) THEN
        RAISE_APPLICATION_ERROR(-20002,'Máximo 1 mes');
    END IF;
END;
/

--------------------------------------------------
-- USUARIO ADMIN EJEMPLO
--------------------------------------------------
INSERT INTO USUARIO VALUES (
    SEC_USUARIOS.NEXTVAL,
    'Admin',
    'Principal',
    'admin@correo.com',
    hash_password('admin123'),
    1
);












