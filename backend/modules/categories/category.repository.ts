import { prisma } from "@src/lib/prisma";

export class CategoryRepository {
  create(input: { name: string }) {
    return prisma.category.create({
      data: input,
      include: {
        _count: {
          select: { albums: true }
        }
      }
    });
  }

  listAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { albums: true }
        }
      }
    });
  }

  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  }

  softDelete(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}
