drop database if exists la_chola;
create database if not exists la_chola;
use la_chola;
create table evento(
id_evento int primary key,
nombre varchar(100),
descripcion varchar(100),
categoria set("animación","documental","experimental","ficción","musical","realidad virtual","intelegencia artificial","fantasía","ciencia ficción","terror","basada en hechos reales","estudiante","no especificado") default "no especificado",
tipo_metraje set("cortometraje","mediometraje","largometraje"),
imagen varchar(300) ,
id_social int,
tasa double,
tipo enum("a","b","c"),
fecha_inicio date,
fecha_final date
);

create table itinerario(
id_itinerario int primary key,
id_evento int,
fecha date,
descripcion text
);

create table evento_detalle(
id_evento_detalle int primary key,
id_evento int,
id_ubicacion int,
id_itinerario int
);
create table ubicacion(
id_ubicacion int primary key,
localizacion varchar(100),
ciudad varchar(100),
provincia varchar(100),
pais varchar(100)
);
create table industria(
id_industria int primary key,
nombre varchar(100),
id_social int,
tipo varchar(100),
plataformas set(""),
id_ubicacion int,
financiacion set(""),
);
drop table industria;
create table social(
id_social int primary key,
facebook varchar(100),
instagram varchar(100)  ,
correo varchar(100) ,
youtube varchar(100)  ,
telefono varchar(100),
web varchar(100) ,
twitter varchar(100)
);

drop database la_chola;
-- Registros de la tabla de Eventos
insert into eventos (id_evento, nombre, descripcion, categoria, tipo_de_metraje, fecha_inicio, fecha_final, imagen, id_social, tasa, tipo)
values
(1, "festival internacional de cine de lebu(24)", 'festival de cortometrajes', 'animación',"ficción","documental",'cortometraje', '2024-04-05', '2024-04-11', 'imagen1.jpg', 1, 0, 'b'),
(2, 'cartagena international film festival', 'festival de cortometrajes y largometrajes', 'documental' "ficción","animación" "fantástico", "terror","experimental", 'cortometraje','largometraje', '2024-04-16', '2024-02-21', 'imagen2.jpg', 2, '60€', 'b'),
(3, 'quirino awards', 'festival de cortometrajes y largometrajes', 'animación', 'cortometraje','largometraje', '2024-05-11', '2024-05-11', 'imagen3.jpg', 3, 0, 'c'),
(4, 'skyline benidorm film festival', 'festival de cortometrajes', 'ficción','documental','animación','fantástico','terror' 'cortometraje', '2024-04-13', '2024-04-20', 'imagen4.jpg', '1', '1,26€', 'b'),
(5, 'festival de málaga', 'festival de cortometrajes y largometrajes', 'ficción','documental','animación','cortometraje' 'largometraje', '2024-03-01', '2024-03-10', 'imagen5.jpg', 2, 0, 'a'),
(6, 'festival de cine de paterna "antonio ferrandis"', 'festival de cortometrajes','24-06-18','2024-06-15', 'imagen6.jpg', 3, 0, 'b'),
(7, ' festifil', '28 festival la fila de cortometrajes','ficción' 'documental' 'animación','cortometraje', '2024-02-15', '2024-02-18', 'imagen7.jpg', 1, 0, 'b'),
(8, 'medina del campo film festival', 'el festival es sinónimo de compromiso hacia el cortometraje', 'ciencia ficción', 'cortometraje', '2024-02-23', '2024-02-24', 'imagen8.jpg', 2, 0, 'c'),
(9, 'emove festival escolar y universitario de las artes audiovisuales', 'el festival escolar y universitario de las artes audiovisuales, en su 7ª convocatoria, tiene una duración de un curso escolar.', 'ficción','documental','animación','experimental','musical', 'cortometraje', '2023-11-11', '2023-11-12', 'imagen9.jpg', 3, 0, 'b'),
(10, 'popayán', 'festival de cine colombiano', 'ficción','documental','animación','experimental','musical', 'cortometraje','largometraje', '2024-10-19', '2024-10-21', 'imagen10.jpg', 1, 0, 'b');
-- Insertar registros en la tabla Itinerario
INSERT INTO Itinerario (id_itinerario, id_evento, fecha, descripcion)
VALUES
(1, 101, '2023-12-15', 'Inicio del festival de cine en Lebu'),
(2, 102, '2023-12-16', 'Proyecciones y charlas del festival de Cartagena'),
(3, 103, '2023-12-17', 'Entrega de premios Quirino Awards'),
(4, 104, '2023-12-18', 'Cortometrajes destacados en Skyline Benidorm Film Festival'),
(5, 105, '2023-12-19', 'Inauguración del Festival de Málaga'),
(6, 106, '2023-12-20', 'Destacados en el Festival de Cine de Paterna "Antonio Ferrandis"'),
(7, 107, '2023-12-21', 'Festifil: 28 Festival La Fila de Cortometrajes'),
(8, 108, '2023-12-22', 'Destacados en Medina del Campo Film Festival'),
(9, 109, '2023-12-23', 'EMOVE Festival Escolar y Universitario de las Artes Audiovisuales'),
(10, 110, '2023-12-24', 'Cierre del festival de Popayán');
-- Insertar registros en la tabla Evento_detalle
INSERT INTO Evento_detalle (id_evento_detalle, id_evento, id_ubicacion, id_itinerario)
VALUES
(1, 101, 201, 1),
(2, 102, 202, 2),
(3, 103, 203, 3),
(4, 104, 204, 4),
(5, 105, 205, 5),
(6, 106, 206, 6),
(7, 107, 207, 7),
(8, 108, 208, 8),
(9, 109, 209, 9),
(10, 110, 210, 10);
-- Insertar registros en la tabla Ubicacion
INSERT INTO Ubicacion (id_ubicacion, localizacion, ciudad, provincia, pais)
VALUES
(201, 'Teatro Municipal', 'Santiago', 'Santiago', 'Chile'),
(202, 'Centro de Convenciones', 'Cartagena', 'Bolívar', 'Colombia'),
(203, 'Teatro Nacional', 'Santa Cruz de Tenerife', 'Santa Cruz de Tenerife', 'España'),
(204, 'Auditorio Benidorm', 'Benidorm', 'Alicante', 'España'),
(205, 'Palacio de Ferias', 'Málaga', 'Málaga', 'España'),
(206, 'Cine de la Ciudad', 'Paterna', 'Valencia', 'España'),
(207, 'Centro Cultural', 'Bogotá', 'Bogotá', 'Colombia'),
(208, 'Teatro Principal', 'Medina del Campo', 'Valladolid', 'España'),
(209, 'Centro Escolar y Universitario', 'Ciudad de México', 'Ciudad de México', 'México'),
(210, 'Centro de Convenciones', 'Popayán', 'Cauca', 'Colombia');
-- Insertar registros en la tabla Industria 
INSERT INTO Industria (id_industria, nombre, id_social, tipo, plataformas, id_ubicacion, financiacion)
VALUES
(301, 'Productora de Cine XYZ', 1, 'Producción Cinematográfica', 'Netflix, Hulu', 201, 'Crowdfunding'),
(302, 'Distribuidora de Cine Global', 2, 'Distribución Cinematográfica', 'Cines, Plataformas Digitales', 202, 'Inversionistas Privados'),
(303, 'Estudio de Efectos Especiales FX Masters', 3, 'Efectos Visuales', 'Producciones Cinematográficas', 203, 'Venture Capital'),
(304, 'Compañía de Postproducción Film Edit', 4, 'Postproducción Cinematográfica', 'Estudios de Cine', 204, 'Préstamos Bancarios'),
(305, 'Escuela de Cine Creativo', 5, 'Educación Cinematográfica', '', 205, 'Subvenciones Gubernamentales'),
(306, 'Estudio de Animación Animatrix', 6, 'Producción de Animación', 'YouTube', 206, 'Subsidios Gubernamentales'),
(307, 'Empresa de Alquiler de Equipos Cinematográficos', 7, 'Servicios Cinematográficos', 'Productoras, Estudios', 207, 'Venture Capital'),
(308, 'Estudio de Cinematografía Independiente', 8, 'Producción Cinematográfica', 'Festivales de Cine', 208, 'Préstamos Bancarios'),
(309, 'Laboratorio de Sonido Sonic Studios', 9, 'Postproducción de Sonido', 'Estudios de Grabación', 209, 'Subvenciones Gubernamentales'),
(310, 'Empresa de Subtitulado y Traducción CineLingo', 10, 'Servicios de Traducción', 'Productoras, Distribuidoras', 210, 'Inversionistas Privados');
-- Insertar registros ficticios en la tabla Social con nombres relacionados
INSERT INTO Social (id_social, facebook, instagram, correo, youtube, telefono, web, twitter)
VALUES
(1, 'facebook.com/imaginacine', 'instagram.com/imaginacine', 'contacto@imaginacine.com', 'youtube.com/c/imaginacine', '+123456789', 'www.imaginacine.com', '@imaginacine'),
(2, 'facebook.com/cinevision', 'instagram.com/cinevision', 'info@cinevision.com', 'youtube.com/c/cinevision', '+987654321', 'www.cinevision.com', '@cinevision_oficial'),
(3, 'facebook.com/cinestudio', 'instagram.com/cinestudio', 'contacto@cinestudio.com', 'youtube.com/c/cinestudio', '+111222333', 'www.cinestudio.com', '@cinestudio'),
(4, 'facebook.com/postprocompany', 'instagram.com/postprocompany', 'info@postprocompany.com', 'youtube.com/c/postprocompany', '+444555666', 'www.postprocompany.com', '@postprocompany'),
(5, 'facebook.com/edufilmschool', 'instagram.com/edufilmschool', 'contacto@edufilmschool.com', 'youtube.com/c/edufilmschool', '+777888999', 'www.edufilmschool.com', '@edufilmschool'),
(6, 'facebook.com/animatrixstudios', 'instagram.com/animatrixstudios', 'info@animatrixstudios.com', 'youtube.com/c/animatrixstudios', '+101112131', 'www.animatrixstudios.com', '@animatrixstudios'),
(7, 'facebook.com/cineequip', 'instagram.com/cineequip', 'contacto@cineequip.com', 'youtube.com/c/cineequip', '+141516171', 'www.cineequip.com', '@cineequip_oficial'),
(8, 'facebook.com/indiefilmstudio', 'instagram.com/indiefilmstudio', 'info@indiefilmstudio.com', 'youtube.com/c/indiefilmstudio', '+181920212', 'www.indiefilmstudio.com', '@indiefilmstudio'),
(9, 'facebook.com/soundlabstudios', 'instagram.com/soundlabstudios', 'contacto@soundlabstudios.com', 'youtube.com/c/soundlabstudios', '+222324252', 'www.soundlabstudios.com', '@soundlabstudios'),
(10, 'facebook.com/translatemovies', 'instagram.com/translatemovies', 'info@translatemovies.com', 'youtube.com/c/translatemovies', '+262728293', 'www.translatemovies.com', '@translatemovies');
-- Añadir las Foreigns Keys
alter table evento add (
foreign key (id_social) references social(id_social)
);
alter table itinerario add (
foreign key (id_evento) references eventos(id_evento)
);
alter table evento_detalle add (
foreign key (id_evento) references eventos(id_evento),
foreign key (id_ubicacion) references ubicacion(id_ubicacion),
foreign key (id_itinerario) references itinerario(id_itinerario)
);
Alter table Industria add(
     foreign key (id_social) references social(id_social)
);