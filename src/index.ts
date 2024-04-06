import { Hono } from "hono";
import connectDb from "./db/connect";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { FavYoutubeVideosModel } from "./db/fav-youtuber-model";
import { isValidObjectId } from "mongoose";

const app = new Hono();

//middlewares
app.use(poweredBy());
app.use(logger());

connectDb()
  .then(() => {
    //Get the documents
    app.get("/", async (c) => {
      const documents = await FavYoutubeVideosModel.find({});

      return c.json(documents, 200);
    });

    //Create the documents
    app.post("/", async (c) => {
      const formData = await c.req.json();

      if (!formData.thumbnailUrl) {
        delete formData.thumbnailUrl;
      }

      const favYoutubeVideosObj = new FavYoutubeVideosModel(formData);

      try {
        const document = await favYoutubeVideosObj.save();

        return c.json(document.toObject(), 200);
      } catch (error) {
        return c.json((error as any)?.message || "Internal Server Error", 500);
      }
    });

    //Get Document By Id
    app.get("/:id", async (c) => {
      const { id } = c.req.param();

      if (!isValidObjectId(id)) {
        return c.json("Invalid Id", 400);
      }

      const document = await FavYoutubeVideosModel.findById(id);

      if (!document) {
        return c.json("Invalid Id", 400);
      }

      return c.json(document.toObject(), 200);
    });
  })
  .catch((err) => {
    app.get("/*", (c) => {
      return c.text(`Failed to connect mongodb : ${err.message}`);
    });
  });

app.onError((err, c) => {
  return c.text(`App Error : ${err.message}`);
});

export default app;
