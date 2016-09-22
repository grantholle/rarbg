# RARGB

This is a very simple api wrapper in Node using Promises.

## Installation

```(bash)
$ npm i rargb --save
```

## Usage

There are two methods, `search()` and `list()` that you can use. The `search()` method takes an object of options (see below) for various searching and sorting capabilities.

```(javascript)
const rargb = require('rargb')

// Searching by various parameters
rargb.search({
    search_string: 'star wars',
    sort: 'seeders',
    category: rargb.categories.MOVIES_X264_1080,
    min_seeders: 50
  })
  .then(response => console.log(response))
  .catch(err => console.error(err))

// List recent torrents
rargb.list()
  .then(response => console.log(response))
  .catch(err => console.error(err))
```

## Options

### Searching
- `search_string`: The string to search
- `search_imdb`: Search by imdb id
- `search_tvdb`: Search by tvdb id
- `search_themoviedb`: Search by TMdb id

### Categories
- `category`: The only two string values can be `'movies'` and `'tv'`, but you can use the following constants:

```(javascript)
rargb.categories.XXX
rargb.categories.MOVIES_XVID
rargb.categories.MOVIES_XVID_720
rargb.categories.MOVIES_X264
rargb.categories.MOVIES_X264_1080
rargb.categories.MOVIES_X264_720
rargb.categories.MOVIES_X264_3D
rargb.categories.MOVIES_FULL_BD
rargb.categories.MOVIES_BD_REMUX
rargb.categories.TV_EPISODES
rargb.categories.TV_HD_EPISODES
rargb.categories.MUSIC_MP3
rargb.categories.MUSIC_FLAC
rargb.categories.GAMES_PC_ISO
rargb.categories.GAMES_PC_RIP
rargb.categories.GAMES_PS3
rargb.categories.GAMES_XBOX_360
rargb.categories.SOFTWARE_PC_ISO
rargb.categories.E_BOOKS
```

**Note:** The `category` option only allows for one category, although the api itself allows for more.

### Sorting
- `sort`: Possible values are `'seeders'`, `'leechers'`, or `'last'`

### Limiting
- `limit`: Possible values are `25`, `50`, or `100`. Default is `25`

### Minimum seeders/leechers
- `min_seeders`: Numerical value for the minimum seeders available
- `min_leechers`: Numerical value for the minimum leechers available


## License

MIT
