create database basketeenprev;
use basketeenprev;

create table usuario(
	id int primary key not null auto_increment,
    nome varchar(255),
    idade int,
    email varchar(255),
    senha varchar(100),
    codigo int,
    status enum("usuario", "fisioterapeuta") default("usuario")
);

create table postar(
    id int primary key not null auto_increment,
    titulo varchar(255),
    texto text,
    imagem text
);