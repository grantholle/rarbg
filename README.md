# RARBG

This is a very simple [rarbg api](https://torrentapi.org/apidocs_v2.txt) wrapper in Node using Promises.

## Installation

```bash
$ npm i rarbg --save
```

## Usage

### Initialize

```javascript
const RarbgApi = require('rarbg')

// Create a new instance of the module.
const rarbg = new RarbgApi()
```

You can pass the configuration by the constructor:

```javascript
const rarbg = new RarbgApi({
  host: 'torrentapi.org',
  path: '/pubapi_v2.php?',
  app_id: 'my_application',
  user_agent: 'My Application 0.0.1'
})
```

### Methods

There are two methods, `search()` and `list()` that you can use. The `search()` method takes an object of options (see below) for various searching and sorting capabilities. Both methods return an array of objects containing `filename`, `category`, and `download` properties, or an error in the case of nothing being found or a different error.

```javascript
// Searching by various parameters
rarbg.search({
    search_string: 'star wars',
    sort: 'seeders',
    category: rarbg.categories.MOVIES_X264_1080,
    min_seeders: 50
  })
  .then(response => {
    console.log(response)
    // Output:
    // [
    //   {
    //     "filename": "Star.Wars.Episode.VII.The.Force.Awakens.2015.1080p.BluRay.H264.AAC-RARBG",
    //     "category": "Movies/x264/1080",
    //     "download": "magnet:?xt=urn:btih:..."
    //   },
    //   {
    //     "filename": "Star.Wars.Episode.VII.The.Force.Awakens.2015.1080p.BluRay.x264-Replica",
    //     "category": "Movies/x264/1080",
    //     "download": "magnet:?xt=urn:btih:..."
    //   }
    // ]
  })
  .catch(err => console.error(err))

// List recent torrents
rarbg.list()
  .then(response => {
    console.log(response)
    // Output:
    // [
    //   {
    //     "filename": "Those.Who.Cant.S02E02.HDTV.x264-AMBIT[rartv]",
    //     "category": "TV Episodes",
    //     "download": "magnet:?xt=urn:btih:..."
    //   },
    //   {
    //     "filename": "Those.Who.Cant.S02E02.720p.HDTV.x264-AMBIT[rartv]",
    //     "category": "TV HD Episodes",
    //     "download": "magnet:?xt=urn:btih:..."
    //   }
    //   ...
    // ]
  })
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

```javascript
rarbg.categories.XXX
rarbg.categories.MOVIES_XVID
rarbg.categories.MOVIES_XVID_720
rarbg.categories.MOVIES_X264
rarbg.categories.MOVIES_X264_1080
rarbg.categories.MOVIES_X264_720
rarbg.categories.MOVIES_X264_3D
rarbg.categories.MOVIES_X264_4K
rarbg.categories.MOVIES_X265_4K
rarbg.categories.MOVIES_X265_4K_HDR
rarbg.categories.MOVIES_FULL_BD
rarbg.categories.MOVIES_BD_REMUX
rarbg.categories.TV_EPISODES
rarbg.categories.TV_HD_EPISODES
rarbg.categories.MUSIC_MP3
rarbg.categories.MUSIC_FLAC
rarbg.categories.GAMES_PC_ISO
rarbg.categories.GAMES_PC_RIP
rarbg.categories.GAMES_PS3
rarbg.categories.GAMES_XBOX_360
rarbg.categories.SOFTWARE_PC_ISO
rarbg.categories.E_BOOKS
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

[MIT](LICENSE.txt)
