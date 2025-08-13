import { WebSocketServer } from "ws";
import { knex } from "./dbInit.js";

const wss = new WebSocketServer({ port: 8080 });
console.log("Server started");

wss.on("connection", async (ws) => {
    console.log("New client connected");

    const notes = await knex('notes').select("*");
    ws.send(JSON.stringify({type: "init", notes}));

    ws.on("message", async (message) => {
        try{
            const data = JSON.parse(message);

            if (data.type === 'new_note'){
                const [id] = await knex('notes').insert({
                    messageText: data.text,
                    cordX: data.X,
                    cordY: data.Y
                });

                const note = {id, messageText: data.text, cordX: data.X, cordY: data.Y};

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN){
                        client.send(JSON.stringify({type: 'note_added', note}));
                    }
                });
            }
        }
        catch (err){
            console.log(err);
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
