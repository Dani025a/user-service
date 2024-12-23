import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.USER_SERVICE_PORT;

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});