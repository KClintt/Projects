# The Picture Never Changed

A short browser game made for an English project. You take photos at age nine and see how the same shots feel years later.

## Play

Open `index.html` in a browser. Keep the files together. The game works offline without an installation.

- Move your mouse to frame a scene and click to shoot. On a touchscreen, touch the scene to position the frame, then tap **Take picture**.
- With the viewfinder focused, use the arrow keys to aim, Shift + arrow for finer adjustments, and Space or Enter to shoot. The named moment buttons move the viewfinder near each subject.
- Photograph anything in the room. Extra shots and repeat shots go in the album, and three distinct family moments unlock the next chapter. At ages 17 and 25, open at least three photos and use the age buttons to compare captions.
- Sound starts off. The **Motion** button follows your device preference at first and can be toggled during play.
- Photos stay in the current playthrough. Use **Save this photo** in the final album to download a PNG before restarting or closing the page.

## Share or submit

Send the ZIP so the recipient can unzip it and open `index.html` or `demo.html`. For a web link, publish the files with GitHub Pages.

## How the code works

- `index.html` loads the game. `demo.html` opens it in short mode.
- `game.js` handles the camera, album, captions, and chapter changes. Start with `moments` to edit the subjects or captions.
- `rooms.js` draws the rooms and characters on the canvas.
- `style.css` controls the page layout and colors.

When you take a photo, the game crops the canvas and saves a PNG. The album uses that same PNG at each age and looks up a different caption.

## Teacher demo

Open `demo.html` for a roughly one-minute walkthrough. Frame one family photo, see its caption change at all three ages, choose an interpretation, and take a final photo of the present. Keep the game files together.

## Publish with GitHub Pages

1. In **Settings → Pages**, select **Deploy from a branch**, then choose **main** and **/ (root)**. Save.
2. After Pages finishes deploying, use the URL shown in **Settings → Pages**. Share the base URL for the full game or append `demo.html` for the teacher demo.

The hosted game runs in any modern browser without Codex, an account, or a build step.
