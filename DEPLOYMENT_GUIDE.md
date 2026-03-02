# Deployment Guide: Holi Special for Manika

Follow these steps to upload your project to GitHub and deploy it to Vercel.

## 1. Prepare Your Assets
Before uploading, ensure you have placed your images in the `assets/` folder with the following names:
- `cat-top.gif` (Animated mascot for top right)
- `cat-bottom.gif` (Animated mascot for bottom left)
- `basket.png` (The basket for the game)
- `music.mp3` (Optional background music)
- `splash1.png`, `splash2.png`, `splash3.png` (Optional custom splash shapes)

## 2. Upload to GitHub
1. Go to [GitHub](https://github.com) and create a new repository named `holi-manika`.
2. Open your terminal/command prompt in your project folder.
3. Run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Holi Special for Manika"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/holi-manika.git
   git push -u origin main
   ```

## 3. Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and log in.
2. Click **"Add New"** -> **"Project"**.
3. Import your `holi-manika` repository.
4. Vercel will automatically detect it as a **"Other"** or **"Static"** project.
5. Click **"Deploy"**.
6. Wait 30 seconds, and your site will be live!

## 4. Common Mistakes (White Screen Fixes)
If you see a white screen on Vercel, check these:

- **Case Sensitivity**: Linux servers (like Vercel) are case-sensitive. `Assets/Image.png` is NOT the same as `assets/image.png`. Ensure all your file and folder names are lowercase.
- **Relative Paths**: Always use `./assets/file.png` or `assets/file.png`. Never use absolute paths like `/assets/file.png` as they might fail depending on the base URL.
- **Missing index.html**: Ensure `index.html` is in the root directory, not inside another folder.
- **Broken JavaScript**: Open the browser console (F12). If there's a red error, the script might have stopped execution. Check your variable names and DOM selections.

## 5. How to Fix
- If an image is missing: Check the `src` attribute in `index.html` and compare it exactly with the filename in the `assets/` folder.
- If the game doesn't start: Ensure `script.js` is correctly linked at the bottom of `index.html`.
