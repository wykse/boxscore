# Boxscore

A Firefox extension to get box score for NBA game highlight videos on YouTube.

Extension works for game highlights from NBA's YouTube channel. The reason for this is because the title is used to validate the video is an NBA game before fetching the stats.

![Example](/assets/images/boxscore.png)

## Usage

Double-click anywhere to load the box score.

## Temporary install
Clone repo then

- [Temporarily load a web extension](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html#loading-a-temporary-extension) from a directory on disk

or run

- `web-ext run`

## TODO
- Need NBA API for game id
- Add context menu to get the box score
- Remove css from script and inject css file instead