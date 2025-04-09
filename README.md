# ReviveAI: AI-Powered Historical Image Restoration

Bringing the Past into the Present - An advanced AI solution for restoring and colorizing historical photographs with exceptional accuracy and detail.

## 🌟 Features

- High-resolution image enhancement using ESRGAN/SRGAN
- Intelligent colorization of black and white photographs
- Texture and detail preservation
- Video processing capabilities
- User-friendly web interface

## 🏗️ Project Structure

```
ReviveAI/
├── client/               # React frontend
├── server/              # Node.js backend
└── ai/                  # Flask AI service
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- MongoDB

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Hack2Future-IIIT-Dharwad/Upressors_Smruti.git
cd Upressors_Smruti
```

2. **Set up the Frontend (Client)**
```bash
cd client
npm install
# Create .env file with necessary environment variables
npm run dev
```

3. **Set up the Backend (Server)**
```bash
cd server
npm install
# Create .env file with necessary environment variables
npm start
```

4. **Set up the AI Service**
```bash
cd ai
python -m venv upressors
source upressors/bin/activate  # On Windows: upressors\Scripts\activate
pip install -r requirements.txt
python app.py
```



## 🔧 Architecture

- **Frontend**: React application handling user interface and image upload
- **Backend**: Node.js server managing authentication, data storage, and communication with AI service
- **AI Service**: Flask API running the image restoration models
- **Database**: MongoDB storing user data and image metadata



## 👥 Team

- [Smruti Patil](https://github.com/SmrutiPatil) - Team Lead
- [Mandar Dighe](https://github.com/Mandy767) 
- [Ratnesh Kherudkar](https://github.com/r4tnx) 
- [Jahnavi Enduri](https://github.com/endurijahnavi)



## 📚 References
- [ESRGAN](https://arxiv.org/abs/1809.00219)
- [Style Transfer](https://arxiv.org/abs/1705.06830)
- [Stability.AI](https://platform.stability.ai/)
- [Image colorization](https://github.com/jantic/DeOldify)
