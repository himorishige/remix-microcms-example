/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { z } from 'zod';
import type { MicroCMSDate, MicroCMSImage } from 'microcms-js-sdk';

const schemaForType =
  <T>() =>
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

export type Content = {
  id: string;
  title: string;
  image: MicroCMSImage;
  body: string;
  cover?: MicroCMSImage;
} & MicroCMSDate;

export type Contents = {
  contents: Content[];
};

const microCMSImageSchema = schemaForType<MicroCMSImage>()(
  z.object({
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
);

export const contentSchema = schemaForType<Content>()(
  z.object({
    id: z.string(),
    title: z.string(),
    image: microCMSImageSchema,
    cover: microCMSImageSchema.optional(),
    body: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    revisedAt: z.string(),
  }),
);

export const contentsSchema = schemaForType<Contents>()(
  z.object({
    contents: contentSchema.array(),
  }),
);
