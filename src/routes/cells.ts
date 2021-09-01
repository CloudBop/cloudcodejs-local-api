import express from "express";
// async rather than callback
import fs from "fs/promises";
import path from "path";
interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

const router = express.Router();

export const createCellsRouter = (filename: string, dir: string) => {
  //
  const fullPath = path.join(dir, filename);
  // body parse to json
  router.use(express.json());

  router.get("/cells", async (req, res) => {
    try {
      // readfile
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      // parse cells out of data
      res.send(JSON.parse(result));
    } catch (error) {
      // if error, no file exists
      if (error.code === "ENOENT") {
        // else create default settings
        await fs.writeFile(fullPath, "[]", "utf-8");
        res.send([]);
      } else {
        throw error;
      }
      // send cells back to browser
    }
  });
  router.post("/cells", async (req, res) => {
    // take the list of cells from the request obj
    // serialize them
    const { cells }: { cells: Cell[] } = req.body;
    // write cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });

  return router;
};
