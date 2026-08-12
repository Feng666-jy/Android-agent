import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma.js'
import {
  getModels,
  toggleFavorite,
  setDefault,
  getGroups,
  createGroup,
  deleteGroup,
  moveModelsToGroup,
  ModelNotFoundError,
  ModelGroupNotFoundError
} from '../services/model.service.js'
import { success, fail, notFound } from '../utils/response.js'

/**
 * Model Controller — thin controller pattern
 * Parses HTTP, delegates to service, maps errors.
 */
export const modelController = {
  /** GET /models — list with search/sort/filter/pagination */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, providerId, groupId, isFavorite, sort, page, pageSize } = req.query

      const result = await getModels(prisma, {
        search: search as string | undefined,
        providerId: providerId as string | undefined,
        groupId: groupId as string | undefined,
        isFavorite: isFavorite !== undefined ? isFavorite === 'true' : undefined,
        sort: (sort as 'name' | 'created' | 'usage' | 'favorite') || 'default',
        page: page ? parseInt(page as string, 10) : 1,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : 20
      })
      success(res, result)
    } catch (error) {
      next(error)
    }
  },

  /** POST /models/:id/favorite — toggle favorite status */
  async toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const model = await toggleFavorite(prisma, req.params.id)
      success(res, model)
    } catch (error) {
      if (error instanceof ModelNotFoundError) {
        notFound(res, error.message)
      } else {
        next(error)
      }
    }
  },

  /** POST /models/:id/default — set as default model */
  async setDefault(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const model = await setDefault(prisma, req.params.id)
      success(res, model)
    } catch (error) {
      if (error instanceof ModelNotFoundError) {
        notFound(res, error.message)
      } else {
        next(error)
      }
    }
  },

  /** GET /model-groups — list all groups */
  async listGroups(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const groups = await getGroups(prisma)
      success(res, groups)
    } catch (error) {
      next(error)
    }
  },

  /** POST /model-groups — create a group */
  async createGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description, icon, color } = req.body
      if (!name?.trim()) {
        fail(res, 'Group name is required', 1001)
        return
      }
      const group = await createGroup(prisma, { name, description, icon, color })
      success(res, group, 'Group created successfully', 201)
    } catch (error) {
      next(error)
    }
  },

  /** DELETE /model-groups/:id — delete a group */
  async deleteGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await deleteGroup(prisma, req.params.id)
      success(res, null, 'Group deleted successfully')
    } catch (error) {
      if (error instanceof ModelGroupNotFoundError) {
        notFound(res, error.message)
      } else {
        next(error)
      }
    }
  },

  /** POST /models/move — move models to a group */
  async moveToGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { modelIds, groupId } = req.body
      if (!Array.isArray(modelIds) || modelIds.length === 0) {
        fail(res, 'modelIds must be a non-empty array', 1001)
        return
      }
      const result = await moveModelsToGroup(prisma, modelIds, groupId ?? null)
      success(res, result)
    } catch (error) {
      next(error)
    }
  },

  /** POST /models/search — convenience search endpoint */
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q } = req.body
      const result = await getModels(prisma, {
        search: q?.trim() || '',
        sort: 'usage',
        pageSize: 50
      })
      success(res, result)
    } catch (error) {
      next(error)
    }
  }
}
