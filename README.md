
# Foxnuts sample (Flask + HTML/CSS/JS)

## Run locally
```
pip install -r requirements.txt
python server.py
```
Open http://127.0.0.1:5000

## Quick demo deploy (PythonAnywhere - simplest)
1. Create an account at pythonanywhere.com
2. Upload the folder contents.
3. Go to **Web** → **Add a new web app** → **Flask** → point it to `server.py`.
4. Reload the web app. You’ll get a `yourname.pythonanywhere.com` URL to share.

## Quick demo deploy (Render.com)
1. Push these files to a Git repo.
2. On Render, create **New** → **Web Service**, use **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `gunicorn server:app`
4. Share the Render URL.
