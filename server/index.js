import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const HOST='0.0.0.0';
const PORT=3001;
const app=express();
app.use(cors({origin:true,credentials:true}));
app.get('/health',(_,res)=>res.json({ok:true,app:'Gap Shap'}));
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:true,methods:['GET','POST'],credentials:true}});
const rooms=new Map();
function list(room){return [...(rooms.get(room)||new Map())].map(([id,u])=>({id,...u}));}
function clean(v,fallback='Guest'){return String(v??'').trim().slice(0,40)||fallback;}
io.on('connection',socket=>{
  socket.on('join-room',({roomId,name})=>{
    const rid=clean(roomId,'ROOM').toUpperCase();
    const displayName=clean(name);
    const room=rooms.get(rid)||new Map();
    const users=list(room);
    room.set(socket.id,{name:displayName,hand:false}); rooms.set(rid,room);
    socket.join(rid); socket.data.roomId=rid; socket.data.name=displayName;
    socket.emit('room-users',users);
    socket.to(rid).emit('user-joined',{id:socket.id,name:displayName});
    io.to(rid).emit('participants',list(room));
  });
  socket.on('signal',({to,data})=>{if(to&&data)io.to(to).emit('signal',{from:socket.id,data});});
  socket.on('chat-message',({text})=>{const room=socket.data.roomId;if(!room||!text?.trim())return;io.to(room).emit('chat-message',{id:socket.id,name:socket.data.name,text:String(text).trim().slice(0,1000),time:Date.now()});});
  socket.on('reaction',({emoji})=>{if(socket.data.roomId)io.to(socket.data.roomId).emit('reaction',{id:socket.id,name:socket.data.name,emoji});});
  socket.on('hand',({active})=>{if(socket.data.roomId)io.to(socket.data.roomId).emit('hand',{id:socket.id,active:!!active});});
  socket.on('disconnect',()=>{const rid=socket.data.roomId;if(!rid)return;const map=rooms.get(rid);if(!map)return;map.delete(socket.id);if(map.size===0)rooms.delete(rid);else{socket.to(rid).emit('user-left',{id:socket.id});io.to(rid).emit('participants',list(map));}});
});
server.listen(PORT,HOST,()=>console.log(`Gap Shap signaling server listening on 0.0.0.0:${PORT}`));
