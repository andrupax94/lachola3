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
foreign key (id_social) references social(id_social)
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

