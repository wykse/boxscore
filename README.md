# Boxscore

A Firefox extension to get box score for NBA game highlight videos on YouTube.

Extension works for game highlights from NBA's YouTube channel. The reason for this is because the title is used to validate the video is an NBA game before fetching the stats.

The extension only provides box scores for 2022-2023 regular season games because the game IDs are hard coded at this time.

![Example](/assets/images/boxscore.png)

## Install

Coming soon.

## Usage

Click on the orange `Box Score` button to toggle the box score on and off. The button is only available on YouTube for videos matching NBA's video naming format.

## Development

Clone repo then

- [Temporarily load a web extension](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html#loading-a-temporary-extension) from a directory on disk

or run

- `web-ext run`

## TODO
- Use an API for game IDs
- Remove css from script and inject css file instead
- Improve box score style