# Start Backend
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command & {Set-Location '$currentDir\backend'; pip install -r requirements.txt; $env:PYTHONPATH='.'; uvicorn app.main:app --reload --host 127.0.0.1 --port 8000}"

# Start Frontend
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command & {Set-Location '$currentDir\frontend'; npm install; npm run dev}"
