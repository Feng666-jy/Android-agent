/**
 * V2 路由聚合
 */
import { Router } from 'express'
import agentV2Routes from './agent.routes.js'
import toolsV2Routes from './tools.routes.js'
import deviceV2Routes from './device.routes.js'

const router = Router()
router.use('/agent', agentV2Routes)
router.use('/tools', toolsV2Routes)
router.use('/devices', deviceV2Routes)
export default router
