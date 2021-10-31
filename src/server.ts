import express from 'express';
import bodyParser from 'body-parser';
import { Request, Response } from "express"
import {filterImageFromURL, deleteLocalFiles} from './util/util';


type ImageReqQuery = {
  image_url: string;
}

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());



  app.get('/filteredimage', async (req: Request<any, any, any, ImageReqQuery>, res) => {
    if(!req.query.image_url) {
      res.status(400).send({response: 'query parameter image_url required.'})
    }

    try {
      const localPath = await filterImageFromURL(req.query.image_url);
      res.sendFile(localPath, {}, err => {
        if(err) {
          throw new Error('File send error')
        }
        // clean up files if any.
        deleteLocalFiles([localPath]);
      })

    }

    catch (e) {
      res.status(500).send({response: 'unable to filter image from provided URL'})
    }
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
