import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPersonajeSrv = async (data: { nombre: string; foto: string }) => {
  return await prisma.personaje.create({
    data,
  });
};

export const getListaPersonajeSrv = async () => {
  return await prisma.personaje.findMany();
};

export const getPersonajeSrv = async (id: number) => {
  return await prisma.personaje.findUnique({
    where: { id },
  });
};

export const deletePersonajeSrv = async (id: number) => {
  return await prisma.personaje.delete({
    where: { id },
  });
};

export const updatePersonajeSrv = async (id: number, data: { nombre?: string; foto?: string }) => {
  return await prisma.personaje.update({
    where: { id },
    data,
  });
};
