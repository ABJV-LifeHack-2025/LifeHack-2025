# Ethical Brand Guide

In the following repo, you'll find the following subdirectories:

## `/app-src`
This subdirectory contains our main app, built with Next.js and Supabase. 

To run the app, first install the necessary dependencies:  

```sh
cd /app-src # If not inside directory

npm install
# or
yarn install
```

Ensure that you provide the necessary API Keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

To spin up the development server, run:
```sh
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`.

## `/browser-extension`
To browser extension is built specifically for Chromium-based browsers (e.g. Chrome, Edge etc.). To run the extension, 

1. Open the browser and go to chrome://extensions/ (Or the alternative extensions page).
2. Enable Developer Mode.
3. Click "Load unpacked".
4. Select the `/browser-extension` folder (Ensure that you have cloned this repo locally).

## `/scripts`
In order to scrape Sustainalytics for future updates,

1. Create and activate a virtual environment
```sh
cd /scripts # If not inside directory
python -m venv <your-env-name>
```
- Activate virtual environment
    - For Windows:
    ```sh
    <your-env-name>\Scripts\activate
    ```
    - For macOS/Linux:
    ```sh
    source <your-env-name>/bin/activate
    ```
2. Install dependencies with:
```sh
pip install -r requirements.txt
```
3. Run links scraper
```sh
python scrape_sustainalytics_links.py
```
4. Run website scraper
```sh
python scrape_sustainalytics.py
```
5. To deactivate the environment when you are done, run:
```sh
deactivate
```
### Configuration (Optional)
- **scrape_sustainalytics_links.py**
  - `FILE_PATH`: Path where scraped links will be saved.
- **scrape_sustainalytics.py**
  - `LINKS_PATH`: Path to the file from which links will be read.
  - `FILE_PATH`: Path where the scraped website data will be saved.
> [!IMPORTANT]
> Ensure that `LINKS_PATH` matches `FILE_PATH` in `scrape_sustainalytics_links.py` so that the correct links are read to parse company data.
