require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize, ChatMessage } = require('./src/models');

const authRoutes = require('./src/routes/authRoutes');
const vilogRoutes = require('./src/routes/vilogRoutes');
const payoutRoutes = require('./src/routes/payoutRoutes');
const limsRoutes = require('./src/routes/limsRoutes');
const rekeningRoutes = require('./src/routes/rekeningRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const tumbalRoutes = require("./src/routes/tumbalRoutes");
const storeRoutes = require("./src/routes/storeRoutes");
const checkOrderRoutes = require("./src/routes/checkOrderRoutes");



const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/vilog', vilogRoutes);
app.use('/api/payout', payoutRoutes);
app.use('/api/lims', limsRoutes);
app.use('/api/rekening', rekeningRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/tumbal", tumbalRoutes);
app.use("/api/store", storeRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/rekening", rekeningRoutes);
app.use("/api/check-order", checkOrderRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Roblox Topup API berjalan' });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(String(roomId));
  });

  socket.on('send_message', async (data) => {
    try {
      const message = await ChatMessage.create({
        roomId: data.roomId,
        senderName: data.senderName,
        senderType: data.senderType || 'buyer',
        message: data.message,
      });
      io.to(String(data.roomId)).emit('receive_message', message);
    } catch (error) {
      socket.emit('chat_error', { message: 'Gagal mengirim pesan', error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(async () => {
    console.log("Database connected");

    await sequelize.sync();

    server.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Gagal konek database:", error.message);
  });
