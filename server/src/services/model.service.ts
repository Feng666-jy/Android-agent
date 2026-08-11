import type { PrismaClient } from "../prisma.js";

// ---- Types ----

export interface GetModelsParams {
  search?: string;
  providerId?: string;
  groupId?: string | null;
  isFavorite?: boolean;
  capability?: string;
  sort?: "name" | "created" | "usage" | "favorite";
  page?: number;
  pageSize?: number;
}

export interface GetModelsResult {
  models: any[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateGroupInput {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

// ---- Errors ----

class ModelNotFoundError extends Error {
  constructor(id: string) {
    super(`Model not found: ${id}`);
    this.name = "ModelNotFoundError";
  }
}

class ModelGroupNotFoundError extends Error {
  constructor(id: string) {
    super(`Model group not found: ${id}`);
    this.name = "ModelGroupNotFoundError";
  }
}

// ---- Core Service Functions ----

/**
 * Get model list with search + filter + sort + pagination.
 */
export async function getModels(prisma: PrismaClient, params: GetModelsParams): Promise<GetModelsResult> {
  const {
    search,
    providerId,
    groupId,
    isFavorite,
    sort = "default",
    page = 1,
    pageSize = 20,
  } = params;

  const where: Record<string, any> = { isEnabled: true };

  if (search?.trim()) {
    where.OR = [
      { displayName: { contains: search.trim() } },
      { modelName: { contains: search.trim() } },
      { aliases: { contains: search.trim() } },
    ];
  }

  if (providerId) {
    where.providerId = providerId;
  }

  if (groupId !== undefined) {
    where.groupId = groupId;
  }

  if (isFavorite !== undefined) {
    where.isFavorite = isFavorite;
  }

  let orderBy: Record<string, string>[] = [{ sortOrder: "asc" }];
  switch (sort) {
    case "name":
      orderBy = [{ displayName: "asc" }];
      break;
    case "created":
      orderBy = [{ createdAt: "desc" }];
      break;
    case "favorite":
      orderBy = [{ isFavorite: "desc" }, { sortOrder: "asc" }];
      break;
    case "usage":
      orderBy = [{ usageStats: { lastUsedAt: "desc" } }];
      break;
  }

  const [models, total] = await Promise.all([
    (prisma.model as any).findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { group: true, usageStats: true },
    }),
    (prisma.model as any).count({ where }),
  ]);

  return { models, total, page, pageSize };
}

/**
 * Toggle a model's favorite status.
 */
export async function toggleFavorite(prisma: PrismaClient, id: string): Promise<any> {
  const existing = await (prisma.model as any).findUnique({ where: { id } });
  if (!existing) {
    throw new ModelNotFoundError(id);
  }

  return (prisma.model as any).update({
    where: { id },
    data: { isFavorite: !existing.isFavorite },
  });
}

/**
 * Set a model as the default, clearing any previous default.
 */
export async function setDefault(prisma: PrismaClient, id: string): Promise<any> {
  const existing = await (prisma.model as any).findUnique({ where: { id } });
  if (!existing) {
    throw new ModelNotFoundError(id);
  }

  return(prisma as any).$transaction(async (tx: any) => {
    await tx.model.updateMany({
      where: { isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
    return tx.model.update({
      where: { id },
      data: { isDefault: true },
    });
  });
}

/**
 * Get all model groups.
 */
export async function getGroups(prisma: PrismaClient): Promise<any[]> {
  return (prisma.modelGroup as any).findMany({
    orderBy: [{ isPinned: "desc" }, { sortOrder: "asc" }],
    include: { _count: { select: { models: true } } },
  });
}

/**
 * Create a new model group.
 */
export async function createGroup(prisma: PrismaClient, input: CreateGroupInput): Promise<any> {
  const maxOrder = await (prisma.modelGroup as any).aggregate({
    _max: { sortOrder: true },
  });

  return (prisma.modelGroup as any).create({
    data: {
      name: input.name.trim(),
      description: input.description,
      icon: input.icon,
      color: input.color,
      sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
    },
  });
}

/**
 * Delete a group and detach its models.
 */
export async function deleteGroup(prisma: PrismaClient, id: string): Promise<void> {
  const existing = await (prisma.modelGroup as any).findUnique({ where: { id } });
  if (!existing) {
    throw new ModelGroupNotFoundError(id);
  }

  await (prisma.model as any).updateMany({
    where: { groupId: id },
    data: { groupId: null },
  });

  await (prisma.modelGroup as any).delete({ where: { id } });
}

/**
 * Move models into a group (or out of it when groupId is null).
 */
export async function moveModelsToGroup(
  prisma: PrismaClient,
  modelIds: string[],
  groupId: string | null
): Promise<{ updated: number }> {
  const result = await (prisma.model as any).updateMany({
    where: { id: { in: modelIds } },
    data: { groupId },
  });

  return { updated: result.count };
}

export { ModelNotFoundError, ModelGroupNotFoundError };