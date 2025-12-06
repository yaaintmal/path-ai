import { Router } from 'express';
import { validateBodyZod, validateParamsZod, upload } from '#middleware';
import {
  createVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  deleteAllVideos,
  updateVideo,
} from '#controllers';
import { VideoInputSchema, VideoUpdateInputSchema, IdParamSchema } from '#schemas';

const videoRouter = Router();

videoRouter.get('/', getAllVideos);
videoRouter.get('/:id', validateParamsZod(IdParamSchema), getVideoById);

videoRouter.post('/', upload.single('video'), validateBodyZod(VideoInputSchema), createVideo);
videoRouter.delete('/', deleteAllVideos);

videoRouter.patch(
  '/:id',
  upload.single('video'),
  validateBodyZod(VideoUpdateInputSchema),
  updateVideo
);

videoRouter.delete('/:id', validateParamsZod(IdParamSchema), deleteVideo);

export default videoRouter;
