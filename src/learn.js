import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { v4 as uuid, v4 } from "uuid";

const app = new Hono();

let videos = [];

app.get("/", (c) => {
  return c.html("<h1>Welcome to Hono</h1>");
});

//Post all Videos
app.post("/video", async (c) => {
  const { videoName, channelName, duration } = await c.req.json();

  const newVideo = {
    id: uuid(),
    videoName,
    channelName,
    duration,
  };

  videos.push(newVideo);

  return c.json(videos);
});

//Get all Videos
app.get("/videos", (c) => {
  return streamText(c, async (stream) => {
    for (const video of videos) {
      await stream.writeln(JSON.stringify(video));
      await stream.sleep(1000);
    }
  });
});

//Get Videos By Id
app.get("/get/video/:id", (c) => {
  const { id } = c.req.param();

  const video = videos.find((video) => video.id === id);

  if (!video) {
    return c.json({ message: "Video Not Found" }, 404);
  }

  return c.json(video);
});

//Update Videos By Id
app.put("/get/video/:id", async (c) => {
  const { id } = c.req.param();

  const videoIndex = videos.findIndex((video) => video.id === id);

  if (videoIndex === -1) {
    return c.json({ message: "Video Not Found" }, 404);
  }

  const { videoName, channelName, duration } = await c.req.json();
  videos[videoIndex] = {
    ...videos[videoIndex],
    videoName,
    channelName,
    duration,
  };

  return c.json(videos[videoIndex]);
});

//Delete Video by Id
app.delete("/delete/video/:id", (c) => {
  const { id } = c.req.param();

  videos = videos.filter((video) => video.id !== id);

  return c.json({ message: "Video deleted Successfully" });
});

//Delete All Videos
app.delete("/delete/all", (c) => {
  videos = [];
  return c.json({ message: "All Videos deleted Successfully" });
});

export default app;
