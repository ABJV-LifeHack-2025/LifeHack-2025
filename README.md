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

## `/Instructions-for-scraping`
In order to scrape Sustainalytics for future updates,

1. install dependencies you do not have with, run :
```sh
pip install chromedriver_py selenium pandas
```
2. run 
```sh
python Sustainalyics_Get_Links.py
```
3. once previous step has finished, run 
```sh
python Sustainalytics_Link_Scraper
```