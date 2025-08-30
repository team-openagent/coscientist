# coscientist

# development settings

1. git clone and move to nextjs directory

2. Create env file 
/nextjs/config/.env.development

3. run firebase emulator
firebase emulators:start —import=./firebase-emulator-data  —export-on-exit

4. run mongo server
docker compose up -d

5. run server
npm run dev