
  
  # HarvestHub 🌱


HarvestHub is a comprehensive web applications designed to empower farmers with crop analysis, disease detection, pest control advice, and generalized farming management techniques.

## Features ✨

- **Crop Health Analysis:** Upload images of plant leaves to identify diseases or nutrient deficiencies instantly.
- **Farming Assistant Voice/Chat:** Ask questions about weather, soil, or farming techniques. Supports multiple languages (English, Hindi, Telugu, Malayalam).
- **Secure Backend API Integration:** Includes built-in obfuscation to protect frontend service keys.

## Getting Started 🚀

**Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <your-repo-link>
   cd harvest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your required API Key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## Security Note 🔒
The frontend API key is strictly obfuscated natively within Vite during the build process to deter basic automated scraping bots. If you plan to deploy this project for wide, public read-write access, we strongly advise transitioning the analysis service calls to a dedicated backend server for maximum security.
## working demo
* live weather

  
<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/e7d12697-7581-40a0-b811-8019999fd98f" />
  


  
* ai chart bot:


<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/7607cb76-9fd9-4065-93e0-cad34416adf6" />



  

* Crop Health Analysis:


<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/8bbeec44-08cd-473b-be7e-5698366f7aed" />

   
* fertilizer store:


<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/2b14c3c9-1f81-4b10-a897-2da9c09d7aa6" />


* crop selling page:


<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/ecb2786e-4a99-427c-8527-62b04401ede7" />




---
*Built with React, Vite, and TailwindCSS.*
 
